import socketio
import eventlet

import server.apps.bubbles.mongodb as mongodb
from server.apps.chat.models import *

# Socket.IO 서버 생성
sio = socketio.Server(async_mode='threading')
app = socketio.WSGIApp(sio)

# Socket.IO 'connect' 이벤트 핸들러
@sio.event
def connect(sid, environ, auth):
    print('connect ', sid)

@sio.on('send_message')
def send_message(sid, data):
    mongodb.save_msg(data)
    roomUUID = data['roomUUID']
    room = Room.objects.get(id=roomUUID)
    if room.room_type == 1:
        #익명채팅방
        blindUser = BlindRoomMember.objects.filter(
            user=User.objects.get(username=data['user']),
            room=room
        )
        print(blindUser[0].nickname)
        sio.emit('display_secret_message', {'nickname': blindUser[0].nickname, 'msg': data['msg']})
    else:
        sio.emit('display_message', data)
    print('massage was saved')

@sio.event
def disconnect(sid):
    print('disconnect ', sid)