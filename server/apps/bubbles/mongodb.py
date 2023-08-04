from pymongo import MongoClient
import datetime
from django.conf import settings
from cryptography.fernet import Fernet
from server.apps.chat.models import *

# MongoDB와 원격 연결
client = MongoClient(getattr(settings, 'MONGO_HOST', None), getattr(settings, 'MONGO_PORT', None))
db = client.pirotchatdb

''' 암호화 하는 데 시간이 더 오래 걸릴 것 같다
# 암호화 키 생성
key = getattr(settings, 'FERNET_KEY', None)
fernet = Fernet(key)

# 암호화
def encrypt(text, key):
    encoded_text = text.encode('utf-8')
    encrypted_text = fernet.encrypt(encoded_text)
    return encrypted_text

# 복호화
def decrypt(encrypted_text, key):
    decrypted_text = fernet.decrypt(encrypted_text).decode('utf-8')
    return decrypted_text
'''

# mongodb에 말풍선 저장
def save_msg(data):
    # collection 생성
    bubble_collection = db.bubble

    # 말풍선 내용 암호화
    # 보낸 사람, 채팅 방 UUID는 암호화 때마다 결과가 바뀌어서 그대로 저장해야 함
    # encryptMsg = encrypt(data["msg"], key)

    nickname = None
    room = Room.objects.get(id=data['roomUUID'])
    if room.room_type == 1:
        # 익명채팅방인 경우에는 nickname을 채팅에 저장함
        # nickname을 변경하더라도 지난 nickname은 그대로 유지됨 => 익명성 강화
        blindUser = BlindRoomMember.objects.filter(
            user=User.objects.get(username=data['user']),
            room=room
        )
        nickname = blindUser[0].nickname
    
    bubble = {
        "user": data['user'],
        "nickname": nickname,
        "room": data['roomUUID'],
        # "content": encryptMsg,
        "content": data['msg'],
        "is_delete": 0,
        "read_cnt": 2,
        "created_at": datetime.datetime.now(tz=datetime.timezone.utc),
        "updated_at": datetime.datetime.now(tz=datetime.timezone.utc),
    }

    bubble_id = bubble_collection.insert_one(bubble).inserted_id
    print(bubble_id)


# mongodb에서 채팅 방 말풍선 가져오기
def get_msg(curRoomPk, curUsername):
    # mongodb 조회 시 curRoomPk는 문자열로 변환해야 한다
    bubbles = list(db.bubble.find({'room': f'{curRoomPk}'}))

    return bubbles
    '''
    # 복호화된 채팅을 담는 배열
    decryptBubbles = []

    for bubble in bubbles:
        decryptBubble = {
            'user': bubble['user'],
            'nickname': bubble['nickname'],
            'room': bubble['room'],
            'content': decrypt(bubble['content'], key),
            'created_at': bubble['created_at']
        }

        decryptBubbles.append(decryptBubble)
    
    return decryptBubbles
    '''