from django.shortcuts import render
from .models import *
import server.apps.bubbles.mongodb as mongodb

# Create your views here.

def test(request):
    print('success')
    return render(request, 'room.html', {'title': 'home'})

def enter_room(request, pk):
    curRoom = Room.objects.get(pk=pk)
    if curRoom.room_type == 1:
        #익명채팅방
        roomMembers = curRoom.blindroommember_set.all()
    else:
        roomMembers = RoomMember.objects.filter(room=curRoom)

    bubbles = mongodb.get_msg(curRoom.pk, request.user.username)
    print(bubbles)

    for member in roomMembers:
        if member.user == request.user:
            return render(
                request,
                'rooms/room.html',
                {
                    'title': curRoom.room_name,
                    'room_uuid': pk,
                    'room_type': curRoom.room_type,
                    'bubbles': bubbles
                }
            )
        
    #채팅방의 멤버가 아니라면 튕기기
    errorMsg = '잘못된 접근입니다.'
    return render(request, 'error.html', {'errorMsg': errorMsg})
    
