from bs4 import BeautifulSoup
import markdown
from pygments.styles import get_style_by_name

import socketio
from asgiref.sync import sync_to_async

from server.apps.chat.models import *
import server.apps.bubbles.views as bubble
import server.apps.posts.views as post

ROOM = 0
BLIND_ROOM = 1
DIRECT_ROOM = 2

# Socket.IO 서버 생성
sio = socketio.AsyncServer(async_mode='asgi')
app = socketio.ASGIApp(sio)

@sio.on('join')
async def handle_join(sid, data):
    sio.save_session(sid, data)
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

    data['msg'] = str(BeautifulSoup(data['msg']))

    extension_configs = {
        'pygments_style': 'solarized-light'
    }

    # 마크다운
    data['msg'] = markdown.markdown(data['msg'], extensions=['fenced_code', 'codehilite'])

    if room.room_type == BLIND_ROOM:
        #익명채팅방
        newBubble = await bubble.save_blind_msg(room, data)
        data['nickname'] = newBubble.nickname
        await sio.emit('display_secret_message', data, to=roomId)
    else:
        newBubble = await bubble.save_msg(room, data)
        await sio.emit('display_message', data, to=roomId)
    print('massage was saved')


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
    if len(newhappydata) == 3:
        newhappy, happyCount, sadCount = newhappydata
    else:
        happyCount, sadCount = newhappydata

    # data['newhappyId'] = newhappy.id
    data['happyCount'] = happyCount
    data['sadCount'] = sadCount

    await sio.emit('display_happy', data, to=roomId)
    print('happy was saved')
    

@sio.on('send_sad')
async def send_sad(sid, data):
    roomId = int(data['roomId'])

    newsaddata = await post.save_sad(data)
    if len(newsaddata) == 3:
        newsad, happyCount, sadCount = newsaddata
    else:
       happyCount, sadCount = newsaddata

    # data['newhappyId'] = newhappy.id
    data['happyCount'] = happyCount
    data['sadCount'] = sadCount

    await sio.emit('display_sad', data, to=roomId)
    print('sad was saved')


@sio.on('send_delete')
async def send_delete(sid, data):
    roomId = int(data['roomId'])
    room = await sync_to_async(Room.objects.get)(id=roomId)

    await post.delete_post(room, data)

    await sio.emit('deleted_post', data, to=roomId)
    print('post was deleted')