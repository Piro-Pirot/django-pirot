from django.shortcuts import render

from server.apps.chat.models import *
from .models import *

# Create your views here.

# DB에 일반 말풍선 저장
def save_msg(room, data):
    curUserObj = User.objects.get(username=data['user'])
    curUser = RoomMember.objects.get(user=curUserObj, room=room)

    # 새 말풍선 저장
    newBubble = Bubble.objects.create(
        user = curUserObj,
        room = room,
        content = data['msg'],
        read_cnt = room.roommember_set.count(),
        file = data['file']
    )
    newBubble.save()

    return newBubble


# DB에 익명 말풍선 저장
def save_blind_msg(room, data):
    # 익명채팅방인 경우에는 nickname을 채팅에 저장함
    # nickname을 변경하더라도 지난 nickname은 그대로 유지됨 => 익명성 강화
    curUserObj = User.objects.get(username=data['user'])
    curBlindUser = BlindRoomMember.objects.get(user=curUserObj, room=room)

    # 새 말풍선 저장
    newBubble = BlindBubble.objects.create(
        user = curUserObj,
        room = room,
        content = data['msg'],
        read_cnt = room.blindroommember_set.count(),
        file = data['file'],
        
        nickname = curBlindUser.nickname,
        profile_img = curBlindUser.profile_img
    )
    newBubble.save()

    return newBubble
