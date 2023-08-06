import json
from django.shortcuts import redirect, render
from .models import *
from server.apps.bubbles.models import *

# Create your views here.

def main_room(request):
    # 현재 로그인 사용자가 참여하고 있는 채팅 방
    myBlindRooms = BlindRoomMember.objects.filter(user=request.user)
    myRooms = RoomMember.objects.filter(user=request.user)

    return render(
        request,
        'rooms/room.html',
        {
            'title': 'Hello world!',
            'room_uuid': '',
            'room_type': '',
            'jsonBubbles': '',
            'myRooms': myRooms,
            'myBlindRooms': myBlindRooms,
        }
    )


# 채팅 방에 입장
def enter_room(request, pk):
    # URL을 통해 방 정보 가져옴
    curRoom = Room.objects.get(pk=pk)
    # 현재 로그인 사용자가 참여하고 있는 채팅 방
    myBlindRooms = BlindRoomMember.objects.filter(user=request.user)
    # 현재 로그인 사용자가 참여하고 있는 채팅 방
    myRooms = RoomMember.objects.filter(user=request.user)
    
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
                    'jsonBubbles': jsonBubbles,
                    'myRooms': myRooms,
                    'myBlindRooms': myBlindRooms,
                }
            )
        
    # 채팅 방의 멤버가 아니라면 튕기기
    errorMsg = '잘못된 접근입니다.'
    return render(request, 'error.html', {'errorMsg': errorMsg})