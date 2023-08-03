import socketio
import eventlet

from server.apps.channels.models import Passer
from server.apps.local_users.models import User
import server.apps.bubbles.mongodb as mongodb

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
    sio.emit('display_message', data)
    print('massage was saved')

@sio.event
def disconnect(sid):
    print('disconnect ', sid)