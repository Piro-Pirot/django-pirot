import socketio

from server.apps.chat.models import *
import server.apps.bubbles.views as bubble

# Socket.IO 서버 생성
sio = socketio.Server(async_mode='threading')
app = socketio.WSGIApp(sio)


# Socket.IO 'connect' 이벤트 핸들러
@sio.event
def connect(sid, environ, auth):
    print('connect ', sid)

@sio.on('send_message')
def send_message(sid, data):
    roomUUID = data['roomUUID']
    room = Room.objects.get(id=roomUUID)
    if room.room_type == 1:
        #익명채팅방
        newBubble = bubble.save_blind_msg(room, data)
        sio.emit('display_secret_message', {'nickname': newBubble.nickname, 'msg': data['msg']})
    else:
        newBubble = bubble.save_msg(data)
        sio.emit('display_message', data)
    print('massage was saved')

@sio.event
def disconnect(sid):
    print('disconnect ', sid)