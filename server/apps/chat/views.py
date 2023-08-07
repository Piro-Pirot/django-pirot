import json
from django.shortcuts import redirect, render
from .models import *
from server.apps.bubbles.models import *
from server.apps.channels.models import *

# Create your views here.

def main_room(request, channelName, type):
    myBlindRooms = ''
    myRooms = ''

    myFriends = ''
    myPassInfo = ''

    myChannels = []

    if not request.user.is_authenticated:
        return redirect('/')
    
    if type == 'main' or type == 'friends':
        # 현재 로그인 사용자가 참여하고 있는 채팅 방
        myBlindRooms = BlindRoomMember.objects.filter(user=request.user, room__channel__channel_name=channelName)
        myRooms = RoomMember.objects.filter(user=request.user, room__channel__channel_name=channelName)

        # 현재 로그인 사용자
        myPassInfo = Passer.objects.filter(passer_name=request.user.name, channel__channel_name=channelName)[0]
        # 현재 로그인 사용자의 채널 구성원들
        myFriends = Passer.objects.filter(channel__channel_name=channelName).exclude(pk=myPassInfo.pk)

        # 현재 로그인 사용자의 소속 채널
        myJoinInfo = Join.objects.filter(user__name=request.user.name)
        for joinInfo in myJoinInfo:
            myChannels.append(Channel.objects.get(channel_name=joinInfo.passer.channel.channel_name))
    else:
        return redirect('/')

    return render(
        request,
        'rooms/roomHome.html',
        {
            'title': 'Hello world!',
            'room_uuid': '',
            'room_type': '',
            'channel': channelName,
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
def enter_room(request, channelName, pk, type):
    myBlindRooms = ''
    myRooms = ''

    myFriends = ''
    myPassInfo = ''

    myChannels = []

    # URL을 통해 방 정보 가져옴
    curRoom = Room.objects.get(pk=pk)

    if not request.user.is_authenticated:
        return redirect('/')
    
    if type == 'main' or type == 'friends':
        # 현재 로그인 사용자가 참여하고 있는 채팅 방
        myBlindRooms = BlindRoomMember.objects.filter(user=request.user)
        # 현재 로그인 사용자가 참여하고 있는 채팅 방
        myRooms = RoomMember.objects.filter(user=request.user)
    
        # 현재 로그인 사용자
        myPassInfo = Passer.objects.filter(passer_name=request.user.name, channel__channel_name=channelName)[0]
        # 현재 로그인 사용자의 채널 구성원들
        myFriends = Passer.objects.filter(channel__channel_name=channelName).exclude(pk=myPassInfo.pk)

        # 현재 로그인 사용자의 소속 채널
        myJoinInfo = Join.objects.filter(user__name=request.user.name)
        for joinInfo in myJoinInfo:
            myChannels.append(Channel.objects.get(channel_name=joinInfo.passer.channel.channel_name))
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
                    'room_uuid': pk,
                    'room_type': curRoom.room_type,
                    'channel': curRoom.channel.channel_name,
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