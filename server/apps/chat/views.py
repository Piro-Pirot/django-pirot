import json
from django.shortcuts import redirect, render
from .models import *
from server.apps.bubbles.models import *
from server.apps.channels.models import *

# Create your views here.

def create_room(request, channelId, target):
    if request.method == 'POST':
        me = request.user
        # 개인 채팅 상대방 알아오기
        you = User.objects.get(name=target)
        
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
            newDirectRoom = Room.objects.create(
                room_name = 'direct',
                channel = Channel.objects.get(id=channelId)
            ).save()
            # 채팅 방 참여자 추가
            RoomMember.objects.create(
                user = me,
                room = newDirectRoom
            ).save()
            RoomMember.objects.create(
                user = you,
                room = newDirectRoom
            ).save()
    
        return redirect(f'/room/{channelId}/{directRoom.pk}/main/')
    
    return redirect('/')


def main_room(request, channelId, type):
    # 로그인 되어 있을 때만 접근
    if not request.user.is_authenticated:
        return redirect('/')
    
    myBlindRooms = ''
    myRooms = ''

    myFriends = ''
    myPassInfo = ''

    myChannels = []

    curChannel = Channel.objects.get(id=channelId)
    
    if type == 'main' or type == 'friends':
        # 현재 로그인 사용자가 참여하고 있는 채팅 방
        myBlindRooms = BlindRoomMember.objects.filter(user=request.user, room__channel__id=channelId)
        myRooms = RoomMember.objects.filter(user=request.user, room__channel=curChannel)

        # 현재 로그인 사용자
        myPassInfo = Passer.objects.filter(passer_name=request.user.name, channel=curChannel)[0]
        # 현재 로그인 사용자의 채널 구성원들
        myFriends = Passer.objects.filter(channel__id=channelId).exclude(pk=myPassInfo.pk)

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
    curChannel = Channel.objects.get(id=channelId)

    if type == 'main' or type == 'friends':
        # 현재 로그인 사용자가 참여하고 있는 채팅 방
        myBlindRooms = BlindRoomMember.objects.filter(user=request.user)
        # 현재 로그인 사용자가 참여하고 있는 채팅 방
        myRooms = RoomMember.objects.filter(user=request.user)
    
        # 현재 로그인 사용자
        myPassInfo = Passer.objects.filter(passer_name=request.user.name, channel=curChannel)[0]
        # 현재 로그인 사용자의 채널 구성원들
        myFriends = Passer.objects.filter(channel=curChannel).exclude(id=myPassInfo.id)

        # 현재 로그인 사용자의 소속 채널
        myJoinInfo = Join.objects.filter(user=request.user)
        for joinInfo in myJoinInfo:
            myChannels.append(Channel.objects.get(id=joinInfo.passer.channel.id))
        print(myChannels)
    else:
        return redirect('/')

    
    if curRoom.room_type == 1:
        #익명채팅방
        roomMembers = curRoom.blindroommember_set.all()
        # 말풍선 데이터 get
        bubbles = BlindBubble.objects.filter(room=curRoom).values(
            'room', 'content', 'is_delete',
            'read_cnt', 'file', 'nickname',
            'profile_img', 'created_at',
            'user__username'
        )
    else:
        roomMembers = RoomMember.objects.filter(room=curRoom)
        # 말풍선 데이터 get
        bubbles = Bubble.objects.filter(room=curRoom).values(
            'room', 'content', 'is_delete',
            'read_cnt', 'file', 'created_at',
            'user__username'
        )

    bubbles = list(bubbles)
    # myRooms = list(myRooms)

    jsonBubbles = json.dumps(bubbles, default=str)
    # jsonRooms = json.dumps(myRooms, default=str)

    # js에서 말풍선을 만들기 위해 쿼리셋을 json으로 변환
    # jsonBubbles = serializers.serialize('json', bubbles)
    # print(jsonBubbles)


    # 현재 로그인 사용자가 채팅 방 멤버라면
    for member in roomMembers:
        if member.user == request.user:
            return render(
                request,
                'rooms/room.html',
                {
                    'title': curRoom.room_name,
                    'room': curRoom,
                    'channel': curChannel,
                    'jsonBubbles': jsonBubbles,
                    'myRooms': myRooms,
                    'myBlindRooms': myBlindRooms,
                    'myFriends': myFriends,
                    'myPassInfo': myPassInfo,
                    'urlType': type,
                    'myChannels': myChannels,
                }
            )
        
    # 채팅 방의 멤버가 아니라면 튕기기
    errorMsg = '잘못된 접근입니다.'
    return render(request, 'error.html', {'errorMsg': errorMsg})