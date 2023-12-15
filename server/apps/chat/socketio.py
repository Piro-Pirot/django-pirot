import base64
import json
import os
import re
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
import server.apps.demo.views as demo
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
def bubble_serializer(bubble_obj):
    dic = {}
    dic['name'] = bubble_obj.name
    dic['content'] = bubble_obj.content
    try:
        dic['file'] = bubble_obj.file.url
    except:
        dic['file'] = ''
    dic['created_at'] = str(bubble_obj.created_at)
    dic['r'] = bubble_obj.r
    dic['g'] = bubble_obj.g
    dic['b'] = bubble_obj.b

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


# Socket.IO 'connect' 이벤트 핸들러
@sio.event
async def connect(sid, environ, auth):
    print('connect ', sid)


@sio.on('send_message')
async def send_message(sid, data):
    # data['msg'] = str(BeautifulSoup(data['msg']))
    print('this is msg...!!!!', data['msg'])
    print('this is markdown msg...!!!', markdown.markdown(str(data['msg'])))

    # 마크다운
    configs = {
        'markdown.extensions.codehilite': {
            # 'linenums': True,
            'pygments_style': 'solarized-light',
            'wrapcode': True
        }
    }
    data['msg'] = markdown.markdown(data['msg'], extensions=['markdown.extensions.fenced_code', 'markdown.extensions.codehilite'], extension_configs=configs)
    print(data['msg'])
    # data['msg'] = data['msg'].replace(r'\n', '<br/>')
    # data['msg'] = data['msg'].replace('\n', '<br/>')
    data['msg'] = markdown.markdown(data['msg'], extensions=['markdown.extensions.nl2br'])
    # data['msg'] = re.sub(r'\n', '<br/>', data['msg'])
    print(data['msg'])

    newBubble = await demo.save_msg(data)
    newBubble = bubble_serializer(newBubble)

    await sio.emit('display_message', newBubble)
    print('massage was saved')


@sio.on('sendCodeSnippet')
async def sendCodeSnippet(sid, data):
    print(data['code'])

    # 마크다운
    data['msg'] = highlight(data['code'], PythonLexer(), HtmlFormatter(style="friendly"))

    print(data['msg'])

    newBubble = await demo.save_msg(data)
    newBubble = bubble_serializer(newBubble)

    await sio.emit('display_message', newBubble)
    print('massage was saved')


@sio.on('send_file')
async def send_file(sid, data):
    print('saving file...')
    print(data['file'])
    buffer = base64.b64decode(data['file'])
    print(buffer)
    today = datetime.today().strftime("%Y%m%d")

    # 디렉토리가 없으면 만들기
    if not os.path.isdir(f'media/{today}/'):
        os.makedirs(f'media/{today}/')
    
    file_list = os.listdir(f'media/{today}')

    filename = f'media/{today}/upload{len(file_list)}.png'
    # 파일 쓰기
    with open(filename, 'wb') as output_file:
        output_file.write(buffer)

    data['file'] = f'/{today}/upload{len(file_list)}.png'
    print(data)
    newBubble = await demo.save_msg(data)
    newBubble = bubble_serializer(newBubble)
    
    await sio.emit('display_message', newBubble)


@sio.event
async def disconnect(sid):
    print('disconnect ', sid)

@sio.on('send_post')
async def send_post(sid, data):
    newpostdata = await demo.save_post(data)
    newpost = newpostdata

    data['newpostId'] = newpost.id
    data['created_at'] = newpost.created_at.strftime('%Y-%m-%d')
    data['happyCount'] = newpost.like
    data['sadCount'] = newpost.sad
    
    await sio.emit('display_post', data)
    print('post was saved')


@sio.on('send_happy')
async def send_happy(sid, data):
    newhappydata, like = await demo.save_happy(data)
    data['happyCount'] = like

    await sio.emit('display_happy', data)
    print('happy was saved')
    

@sio.on('send_sad')
async def send_sad(sid, data):
    newsaddata, sad = await demo.save_sad(data)
    data['sadCount'] = sad

    await sio.emit('display_sad', data)
    print('sad was saved')


@sio.on('send_delete')
async def send_delete(sid, data):
    await demo.delete_post(data)

    await sio.emit('deleted_post', data)
    print('post was deleted')