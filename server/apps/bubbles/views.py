import json
from bs4 import BeautifulSoup
from django.http import JsonResponse
from django.shortcuts import redirect, render
from asgiref.sync import sync_to_async
from django.db.models import F, Func, Value, CharField

from server.apps.chat.models import *
from .models import *

ROOM = 0
BLIND_ROOM = 1
DIRECT_ROOM = 2

# Create your views here.

# DB에 일반 말풍선 저장
async def save_msg(room, data):
    curUserObj = await sync_to_async(User.objects.get)(username=data['user'])
    curUser = await sync_to_async(RoomMember.objects.get)(user=curUserObj, room=room)

    # 새 말풍선 저장
    try:
        is_notice = data['bubbleType']
        newBubble = await sync_to_async(Bubble.objects.create)(
            user = curUserObj,
            room = room,
            content = data['msg'],
            read_cnt = await sync_to_async(room.roommember_set.count)(),
            file = data['file'],
            is_notice = is_notice
        )
    except:
        newBubble = await sync_to_async(Bubble.objects.create)(
            user = curUserObj,
            room = room,
            content = data['msg'],
            read_cnt = await sync_to_async(room.roommember_set.count)(),
            file = data['file']
        )
    await sync_to_async(newBubble.save)()
    print(newBubble)
    return newBubble


# DB에 익명 말풍선 저장
async def save_blind_msg(room, data):
    # 익명채팅방인 경우에는 nickname을 채팅에 저장함
    # nickname을 변경하더라도 지난 nickname은 그대로 유지됨 => 익명성 강화
    curUserObj = await sync_to_async(User.objects.get)(username=data['user'])
    curBlindUser = await sync_to_async(BlindRoomMember.objects.get)(user=curUserObj, room=room)

    # 새 말풍선 저장
    try:
        is_notice = data['bubbleType']
        newBubble = await sync_to_async(BlindBubble.objects.create)(
            user = curUserObj,
            room = room,
            content = data['msg'],
            read_cnt = await sync_to_async(room.blindroommember_set.count)(),
            file = data['file'],
            is_notice = is_notice,
            
            nickname = curBlindUser.nickname,
            profile_img = curBlindUser.profile_img.url.replace('/media', '', 1)
        )
    except:
        newBubble = await sync_to_async(BlindBubble.objects.create)(
            user = curUserObj,
            room = room,
            content = data['msg'],
            read_cnt = await sync_to_async(room.blindroommember_set.count)(),
            file = data['file'],
            
            nickname = curBlindUser.nickname,
            profile_img = curBlindUser.profile_img.url.replace('/media', '', 1)
        )
    await sync_to_async(newBubble.save)()
    
    return newBubble


def load_bubbles(request):
    if request.method == 'POST' and request.user.is_authenticated:
        req = json.loads(request.body)
        room_id = req['roomId']
        
        curRoom = Room.objects.get(id=room_id)
        
        if curRoom.room_type == BLIND_ROOM:
            #익명채팅방
            # 말풍선 데이터 get
            bubbles = BlindBubble.objects.filter(room=curRoom).values(
                'user__username', 'room', 'content', 'is_delete',
                'read_cnt', 'file', 'nickname',
                'profile_img', 'is_notice', 'created_at',
                'user__name'
            ).annotate(
                hour=Func(
                    F('created_at'),
                    Value('%H'),
                    function='DATE_FORMAT',
                    output_field=CharField()
                ),
                min=Func(
                    F('created_at'),
                    Value('%i'),
                    function='DATE_FORMAT',
                    output_field=CharField()
                ),
                year=Func(
                    F('created_at'),
                    Value('%Y'),
                    function='DATE_FORMAT',
                    output_field=CharField()
                ),
                month=Func(
                    F('created_at'),
                    Value('%m'),
                    function='DATE_FORMAT',
                    output_field=CharField()
                ),
                day=Func(
                    F('created_at'),
                    Value('%d'),
                    function='DATE_FORMAT',
                    output_field=CharField()
                ),
            ).order_by('created_at')
        else:
            bubbles = Bubble.objects.filter(room=curRoom).values(
                'user__username', 'room', 'content', 'is_delete',
                'read_cnt', 'file', 'is_notice', 'created_at',
                'user__name'
            ).annotate(
                hour=Func(
                    F('created_at'),
                    Value('%H'),
                    function='DATE_FORMAT',
                    output_field=CharField()
                ),
                min=Func(
                    F('created_at'),
                    Value('%i'),
                    function='DATE_FORMAT',
                    output_field=CharField()
                ),
                year=Func(
                    F('created_at'),
                    Value('%Y'),
                    function='DATE_FORMAT',
                    output_field=CharField()
                ),
                month=Func(
                    F('created_at'),
                    Value('%m'),
                    function='DATE_FORMAT',
                    output_field=CharField()
                ),
                day=Func(
                    F('created_at'),
                    Value('%d'),
                    function='DATE_FORMAT',
                    output_field=CharField()
                ),
            ).order_by('created_at')

        for bubble in bubbles:
            bubble['content'] = str(bubble['content'])
            bubble['file'] = bubble['file'].replace('/', '/media/', 1)
            if 'profile_img' in bubble:
                bubble['profile_img'] = bubble['profile_img'].replace('/', '/media/', 1)

        bubbles = list(bubbles)
        if len(bubbles) == 0:
            return JsonResponse({'result': None})
        
        return JsonResponse({'result': json.dumps(bubbles, default=str)})