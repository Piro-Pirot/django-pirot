import json, datetime
from django.shortcuts import redirect, render
from .models import *
from server.apps.bubbles.models import *
from server.apps.channels.models import *
from server.apps.posts.models import *

from .fakeKorean import *

from django.db.models import Q, F

from bs4 import BeautifulSoup

# Create your views here.

NO = 0
YES = 1

ROOM = 0
BLIND_ROOM = 1
DIRECT_ROOM = 2

def create_room(request, channelId, target):
    if request.method == 'POST':
        me = request.user
        # 개인 채팅 상대방 알아오기
        you = User.objects.get(id=target)
        
        myRooms = RoomMember.objects.filter(user=me)
        yourRooms = RoomMember.objects.filter(user=you)

        directRoom = ''
        
        # 채팅 방 있는지 확인
        for mine in myRooms:
            for yours in yourRooms:
                if mine.room == yours.room:
                    directRoom = mine.room
                    break
            if directRoom != '':
                break

        if not directRoom:
            # 채팅 방 개설
            Room.objects.create(
                room_name = '__direct',
                room_type = DIRECT_ROOM,
                channel = Channel.objects.get(id=channelId)
            ).save()
            newDirectRoom = Room.objects.all().last()
            # 채팅 방 참여자 추가
            RoomMember.objects.create(
                user = me,
                room = newDirectRoom
            ).save()
            RoomMember.objects.create(
                user = you,
                room = newDirectRoom
            ).save()
            directRoom = newDirectRoom

        return redirect(f'/room/{channelId}/{directRoom.id}/main/')
    
    return redirect('/')

def create_group_room(request, channelId):
    if request.method == 'POST':
        curChannel = Channel.objects.get(id=channelId)
        targets = []
        group_type = ROOM
        for key, value in request.POST.items():
            if value == 'on' and key == 'group_type':
                group_type = BLIND_ROOM
            elif value == 'on':
                targets.append(key)
            elif key == 'group_name':
                group_name = value

        new_room = Room.objects.create(
            room_name = group_name,
            room_type = group_type,
            channel = curChannel
        )
        new_room.save()

        # 채팅 방 참여자 추가
        for target in targets:
            target_passer_info = Passer.objects.get(id=target)
            target_user_info = Join.objects.get(passer=target_passer_info).user
            if group_type == BLIND_ROOM:
                BlindRoomMember.objects.create(
                    user = target_user_info,
                    room = new_room,
                    nickname = f'{fake_korean_first()} {fake_korean_second()}',
                    profile_img = 'test.png'
                ).save()
            else:
                RoomMember.objects.create(
                    user = target_user_info,
                    room = new_room
                ).save()

        # 자기 자신도 추가
        if group_type == BLIND_ROOM:
            BlindRoomMember.objects.create(
                user = request.user,
                room = new_room,
                nickname = f'{fake_korean_first()} {fake_korean_second()}',
                profile_img = 'test.png'
            ).save()
        else:
            RoomMember.objects.create(
                user = request.user,
                room = new_room
            ).save()


        return redirect(f'/room/{channelId}/{new_room.id}/friends/')
    
    return redirect(f'/room/{channelId}/main/')

def main_room(request, channelId, type):
    # 로그인 되어 있을 때만 접근
    if not request.user.is_authenticated:
        return redirect('/')
    
    curChannel = Channel.objects.get(id=channelId)

    # 채널이 승인 되지 않았다면
    if curChannel.channel_ok == NO:
        return render(request, 'error.html', {'errorMsg': f'{curChannel.channel_name} 채널이 승인 대기 중입니다'})

    myBlindRooms = ''
    myRooms = ''

    myFriends = ''
    myPassInfo = ''

    myChannels = []

    
    if type == 'main' or type == 'friends':
        # 현재 로그인 사용자가 참여하고 있는 채팅 방
        myBlindRooms = BlindRoomMember.objects.filter(user=request.user, room__channel=curChannel)
        myRooms = RoomMember.objects.filter(user=request.user, room__channel=curChannel)

        # 현재 로그인 사용자
        myPassInfo = Passer.objects.get(passer_name=request.user.name, channel=curChannel)
        # 현재 로그인 사용자의 채널 구성원들
        myFriends = Passer.objects.filter(channel__id=channelId).exclude(id=myPassInfo.id)

        # 내가 즐겨찾기 한 사람
        my_favorites = []
        for friend in myFriends:
            friend_bookmark_info = friend.bookmarked_user.all()
            for bookmark_info in friend_bookmark_info:
                if bookmark_info.bookmarked_user.channel.id == 1 and bookmark_info.user.id == 5:
                    my_favorites.append(bookmark_info.bookmarked_user)
                    # 즐겨찾기 대상은 친구 리스트에서 제거
                    myFriends = myFriends.exclude(id=bookmark_info.bookmarked_user.id)

        # 현재 로그인 사용자의 소속 채널
        myJoinInfo = Join.objects.filter(user=request.user)
        for joinInfo in myJoinInfo:
            myChannels.append(Channel.objects.get(id=joinInfo.passer.channel.id))
    else:
        return redirect('/')

    return render(
        request,
        'rooms/roomHome.html',
        {
            'title': 'Hello world!',
            'channel': curChannel,
            'jsonBubbles': '',
            'myRooms': myRooms,
            'myBlindRooms': myBlindRooms,
            'myFavorites': my_favorites,
            'myFriends': myFriends,
            'myPassInfo': myPassInfo,
            'urlType': type,
            'myChannels': myChannels,
        }
    )


# 채팅 방에 입장
def enter_room(request, channelId, roomId, type):
    if not request.user.is_authenticated:
        return redirect('/')
    
    myBlindRooms = ''
    myRooms = ''

    myFriends = ''
    myPassInfo = ''

    myChannels = []

    # URL을 통해 채널, 채팅 방 정보 가져옴
    curRoom = Room.objects.get(id=roomId)
    title = curRoom.room_name
    curChannel = Channel.objects.get(id=channelId)

    if type == 'main' or type == 'friends':
        # 현재 로그인 사용자가 참여하고 있는 채팅 방
        myBlindRooms = BlindRoomMember.objects.filter(user=request.user, room__channel=curChannel)
        # 현재 로그인 사용자가 참여하고 있는 채팅 방
        myRooms = RoomMember.objects.filter(user=request.user, room__channel=curChannel)
    
        # 현재 로그인 사용자
        myPassInfo = Passer.objects.get(passer_name=request.user.name, channel=curChannel)
        # 현재 로그인 사용자의 채널 구성원들
        myFriends = Passer.objects.filter(channel=curChannel).exclude(id=myPassInfo.id)

        # 내가 즐겨찾기 한 사람
        my_favorites = []
        for friend in myFriends:
            friend_bookmark_info = friend.bookmarked_user.all()
            for bookmark_info in friend_bookmark_info:
                if bookmark_info.bookmarked_user.channel.id == 1 and bookmark_info.user.id == 5:
                    my_favorites.append(bookmark_info.bookmarked_user)
                    # 즐겨찾기 대상은 친구 리스트에서 제거
                    myFriends = myFriends.exclude(id=bookmark_info.bookmarked_user.id)

        # 현재 로그인 사용자의 소속 채널
        myJoinInfo = Join.objects.filter(user=request.user)
        for joinInfo in myJoinInfo:
            myChannels.append(Channel.objects.get(id=joinInfo.passer.channel.id))
    else:
        return redirect('/')

    
    if curRoom.room_type == BLIND_ROOM:
        #익명채팅방
        roomMembers = BlindRoomMember.objects.filter(room=curRoom)
    else:
        roomMembers = RoomMember.objects.filter(room=curRoom)

    if curRoom.room_type == DIRECT_ROOM:
        directRoomMember = curRoom.roommember_set.all()
        for member in directRoomMember:
            if member.user != request.user:
                otherUser = member.user
                break
        title = otherUser.join.get(passer__channel=curChannel).passer

    print(roomMembers)
    # 현재 로그인 사용자가 채팅 방 멤버라면
    for member in roomMembers:
        if member.user == request.user:
            return render(
                request,
                'rooms/room.html',
                {
                    'title': title,
                    'room': curRoom,
                    'channel': curChannel,
                    'myRooms': myRooms,
                    'myBlindRooms': myBlindRooms,
                    'myFavorites': my_favorites,
                    'myFriends': myFriends,
                    'myPassInfo': myPassInfo,
                    'urlType': type,
                    'myChannels': myChannels,
                }
            )
        
    # 채팅 방의 멤버가 아니라면 튕기기
    errorMsg = '잘못된 접근입니다.'
    return render(request, 'error.html', {'errorMsg': errorMsg})
