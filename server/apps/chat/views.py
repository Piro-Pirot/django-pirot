from django.shortcuts import render
from .models import *
from server.apps.bubbles.models import *

from django.core import serializers

# Create your views here.

def test(request):
    print('success')
    return render(request, 'room.html', {'title': 'home'})


# 채팅 방에 입장
def enter_room(request, pk):
    # URL을 통해 방 정보 가져옴
    curRoom = Room.objects.get(pk=pk)
    if curRoom.room_type == 1:
        #익명채팅방
        roomMembers = curRoom.blindroommember_set.all()
        # 말풍선 데이터 get
        bubbles = BlindBubble.objects.filter(room=curRoom)
    else:
        roomMembers = RoomMember.objects.filter(room=curRoom)
        bubbles = Bubble.objects.filter(room=curRoom)
        

    # js에서 말풍선을 만들기 위해 쿼리셋을 json으로 변환
    jsonBubbles = serializers.serialize('json', bubbles)


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
                    'bubbles': bubbles,
                    'jsonBubbles': jsonBubbles
                }
            )
        
    # 채팅 방의 멤버가 아니라면 튕기기
    errorMsg = '잘못된 접근입니다.'
    return render(request, 'error.html', {'errorMsg': errorMsg})