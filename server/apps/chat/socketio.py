import socketio

from server.apps.chat.models import *
import server.apps.bubbles.views as bubble

# Socket.IO 서버 생성
sio = socketio.Server(
        async_mode="eventlet",
        cors_allowed_origins='*',
        )
app = socketio.WSGIApp(sio)

@sio.on('join')
def handle_join(sid, data):
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
def connect(sid, environ, auth):
    print('connect ', sid)


@sio.on('send_message')
def send_message(sid, data):
    roomId = int(data['roomId'])
    room = Room.objects.get(id=roomId)
    if room.room_type == 1:
        #익명채팅방
        newBubble = bubble.save_blind_msg(room, data)
        data['nickname'] = newBubble.nickname
        sio.emit('display_secret_message', data, to=roomId)
    else:
        newBubble = bubble.save_msg(room, data)
        sio.emit('display_message', data, to=roomId)
    print('massage was saved')


@sio.event
def disconnect(sid):
    print('disconnect ', sid)
