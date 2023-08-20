import base64
import json
import os
from bs4 import BeautifulSoup
import markdown
from markdown.extensions.codehilite import CodeHiliteExtension
from pygments.styles import get_style_by_name
from pygments import highlight
from pygments.lexers import PythonLexer
from pygments.formatters import HtmlFormatter


import socketio
from asgiref.sync import sync_to_async

from server.apps.chat.models import *
import server.apps.bubbles.views as bubble
import server.apps.posts.views as post
from django.db.models import F, Func, Value, CharField

from datetime import datetime
import imghdr


ROOM = 0
BLIND_ROOM = 1
DIRECT_ROOM = 2

# Socket.IO 서버 생성
sio = socketio.AsyncServer(async_mode='asgi')
app = socketio.ASGIApp(sio)

# 말풍선 하나 json 변환
def bubble_serializer(bubble_obj, is_blind, profile_img):
    dic = {}
    dic['user'] = bubble_obj.user.username
    dic['user__name'] = bubble_obj.user.name
    dic['room'] = bubble_obj.room.id
    dic['content'] = bubble_obj.content
    dic['is_delete'] = bubble_obj.is_delete
    dic['read_cnt'] = bubble_obj.read_cnt
    try:
        dic['file'] = bubble_obj.file.url
    except:
        dic['file'] = ''
    dic['is_notice'] = bubble_obj.is_notice
    dic['created_at'] = str(bubble_obj.created_at)
    if is_blind:
        dic['nickname'] = bubble_obj.nickname
        dic['profile_img'] = bubble_obj.profile_img.url
    else:
        try:
            dic['profile_img'] = profile_img.url
        except:
            dic['profile_img'] = profile_img

    dic['year'] = dic['created_at'][0:4]
    dic['month'] = dic['created_at'][5:7]
    dic['day'] = dic['created_at'][8:10]
    dic['hour'] = dic['created_at'][11:13]
    dic['min'] = dic['created_at'][14:16]
    json_dic = json.dumps(dic)

    print(json_dic)
    
    return json_dic

@sio.on('join')
async def handle_join(sid, data):
    await sio.save_session(sid, data)
    sio.enter_room(sid, room=data['room'])
    
    '''
    000님이 채팅방에 입장하였습니다.
    근데 join할 때마다 하는 게 아니라 처음 초대될 때 필요

    curRoom = Room.objects.get(pk=data['room'])
    curUser = User.objects.get(pk=data['userId'])

    if curRoom.room_type == 1:
        curBlindUser = BlindRoomMember.objects.get(user=curUser, room=curRoom)
        # 익명질문방
        sio.emit('display_secret_message', {
            'msg': 'hello world',
            'file': '',
            'user': curUser.username,
            'nickname': curBlindUser.nickname,
            'img': curBlindUser.profile_img,
            'roomUUID': curRoom.pk
        }, to=data['room'])
    else:
        sio.emit('display_message', {
            'msg': 'hello world',
            'file': '',
            'user': curUser.username,
            'img': curUser.profile_img,
            'roomUUID': curRoom.pk
        }, to=data['room'])
    '''


# Socket.IO 'connect' 이벤트 핸들러
@sio.event
async def connect(sid, environ, auth):
    print('connect ', sid)


@sio.on('send_message')
async def send_message(sid, data):
    roomId = int(data['roomId'])
    room = await sync_to_async(Room.objects.get)(id=roomId)
    user = await sync_to_async(User.objects.get)(username=data['user'])

    data['msg'] = str(BeautifulSoup(data['msg']))

    # 마크다운
    data['msg'] = markdown.markdown(data['msg'], extensions=[CodeHiliteExtension()], extension_configs={
    'codehilite': {
        'pygments_style': 'default'
    }
})

    if room.room_type == BLIND_ROOM:
        #익명채팅방
        newBubble = await bubble.save_blind_msg(room, data)
        newBubble = bubble_serializer(newBubble, True, '')
    else:
        newBubble = await bubble.save_msg(room, data)
        # newBubble['user_profile_img'] = user.profile_img
        try:
            newBubble = bubble_serializer(newBubble, False, user.profile_img)
        except:
            newBubble = bubble_serializer(newBubble, False, '')


    await sio.emit('display_message', newBubble, to=roomId)
    print('massage was saved')


@sio.on('sendCodeSnippet')
async def sendCodeSnippet(sid, data):
    roomId = int(data['roomId'])
    room = await sync_to_async(Room.objects.get)(id=roomId)
    user = await sync_to_async(User.objects.get)(username=data['user'])

    # 마크다운
    data['msg'] = highlight(data['code'], PythonLexer(), HtmlFormatter(style="friendly"))
    
    if room.room_type == BLIND_ROOM:
        #익명채팅방
        newBubble = await bubble.save_blind_msg(room, data)
        newBubble = bubble_serializer(newBubble, True, '')
    else:
        newBubble = await bubble.save_msg(room, data)
        # newBubble['user_profile_img'] = user.profile_img
        try:
            newBubble = bubble_serializer(newBubble, False, user.profile_img)
        except:
            newBubble = bubble_serializer(newBubble, False, '')

    await sio.emit('display_message', newBubble, to=roomId)
    print('massage was saved')


@sio.on('send_file')
async def send_file(sid, data):
    room_id = int(data['roomId'])
    room = await sync_to_async(Room.objects.get)(id=room_id)
    user = await sync_to_async(User.objects.get)(username=data['user'])
    print('saving file...')
    buffer = base64.b64decode(data['file'])
    print(buffer)
    today = datetime.today().strftime("%Y%m%d")

    # 디렉토리가 없으면 만들기
    if not os.path.isdir(f'media/{today}/'):
        os.makedirs(f'media/{today}/')
    
    file_list = os.listdir(f'media/{today}')
    # 파일 쓰기
    with open(f'media/{today}/upload{len(file_list)}', 'wb') as output_file:
        output_file.write(buffer)
    
    filename = f'media/{today}/upload{len(file_list)}'

    img_type = imghdr.what(f'media/{today}/upload{len(file_list)}')
    
    if img_type != None:
        os.rename(filename, f'{filename}.{img_type}')
        data['file'] = f'/{today}/upload{len(file_list)}.{img_type}'
        print(data)

        if room.room_type == BLIND_ROOM:
            #익명채팅방
            newBubble = await bubble.save_blind_msg(room, data)
            newBubble = bubble_serializer(newBubble, True, '')
        else:
            newBubble = await bubble.save_msg(room, data)
            if user.profile_img == None:
                newBubble = bubble_serializer(newBubble, False, '')
            else:
                newBubble = bubble_serializer(newBubble, False, user.profile_img.url)
        
        await sio.emit('display_message', newBubble, to=room_id)
    else:
        os.remove(filename)


@sio.event
async def disconnect(sid):
    print('disconnect ', sid)


@sio.on('send_post')
async def send_post(sid, data):
    roomId = int(data['roomId'])
    room = await sync_to_async(Room.objects.get)(id=roomId)

    newpostdata = await post.save_post(room, data)
    newpost, happyCount, sadCount = newpostdata

    data['newpostId'] = newpost.id
    data['created_at'] = newpost.created_at.strftime('%Y-%m-%d')
    data['happyCount'] = happyCount
    data['sadCount'] = sadCount
    
    await sio.emit('display_post', data, to=roomId)
    print('post was saved')


@sio.on('send_happy')
async def send_happy(sid, data):
    roomId = int(data['roomId'])

    newhappydata = await post.save_happy(data)
    happyCount, sadCount, curHappyCount, curSadCount = newhappydata

    data['happyCount'] = happyCount
    data['sadCount'] = sadCount
    data['curHappyCount'] = curHappyCount
    data['curSadCount'] = curSadCount

    await sio.emit('display_happy', data, to=roomId)
    print('happy was saved')
    

@sio.on('send_sad')
async def send_sad(sid, data):
    roomId = int(data['roomId'])

    newsaddata = await post.save_sad(data)
    happyCount, sadCount, curHappyCount, curSadCount = newsaddata
    
    data['happyCount'] = happyCount
    data['sadCount'] = sadCount
    data['curHappyCount'] = curHappyCount
    data['curSadCount'] = curSadCount

    await sio.emit('display_sad', data, to=roomId)
    print('sad was saved')


@sio.on('send_delete')
async def send_delete(sid, data):
    roomId = int(data['roomId'])
    room = await sync_to_async(Room.objects.get)(id=roomId)

    await post.delete_post(room, data)

    await sio.emit('deleted_post', data, to=roomId)
    print('post was deleted')