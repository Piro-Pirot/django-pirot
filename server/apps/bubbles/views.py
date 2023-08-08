from django.shortcuts import render
from asgiref.sync import sync_to_async

from server.apps.chat.models import *
from .models import *

# Create your views here.

# DB에 일반 말풍선 저장
async def save_msg(room, data):
    curUserObj = await sync_to_async(User.objects.get)(username=data['user'])
    curUser = await sync_to_async(RoomMember.objects.get)(user=curUserObj, room=room)

    # 새 말풍선 저장
    newBubble = await sync_to_async(Bubble.objects.create)(
        user = curUserObj,
        room = room,
        content = data['msg'],
        read_cnt = await sync_to_async(room.roommember_set.count)(),
        file = data['file']
    )
    await sync_to_async(newBubble.save)()

    return newBubble


# DB에 익명 말풍선 저장
async def save_blind_msg(room, data):
    # 익명채팅방인 경우에는 nickname을 채팅에 저장함
    # nickname을 변경하더라도 지난 nickname은 그대로 유지됨 => 익명성 강화
    curUserObj = await sync_to_async(User.objects.get)(username=data['user'])
    curBlindUser = await sync_to_async(BlindRoomMember.objects.get)(user=curUserObj, room=room)

    # 새 말풍선 저장
    newBubble = await sync_to_async(BlindBubble.objects.create)(
        user = curUserObj,
        room = room,
        content = data['msg'],
        read_cnt = room.blindroommember_set.count(),
        file = data['file'],
        
        nickname = curBlindUser.nickname,
        profile_img = curBlindUser.profile_img
    )
    await sync_to_async(newBubble.save)()

    return newBubble
