from django.shortcuts import render
from server.apps.chat.models import Room

# Create your views here.

def test(request):
    print('success')
    return render(request, 'room.html', {'title': 'home'})

def enter_room(request, pk):
    print(request)
    curRoom = Room.objects.get(pk=pk)
    print(curRoom.room_name)
    return render(
        request,
        'room.html',
        {
            'title': curRoom.room_name,
            'room_uuid': pk
        }
    )
