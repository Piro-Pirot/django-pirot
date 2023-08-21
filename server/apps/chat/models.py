from django.db import models
from server.apps.channels.models import Channel
from server.apps.local_users.models import User
from datetime import datetime
import os

# 채팅 방
class Room(models.Model):
    ROOM = 0
    BLIND_ROOM = 1
    DIRECT_ROOM = 2
    ROOM_TYPE = [
        (ROOM, 'ROOM'),
        (BLIND_ROOM, 'BLIND_ROOM'),
        (DIRECT_ROOM, 'DIRECT_ROOM'),
    ]
    room_name = models.CharField(max_length=64)
    room_type = models.IntegerField(choices=ROOM_TYPE, default=0)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)

    def __str__(self):
         return f'[{self.room_name}] {self.id}'


# 채팅 방 참여자
class RoomMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    enter_time = models.DateTimeField(auto_now=True)
    exit_time = models.DateTimeField(auto_now=True)

    def __str__(self):
         return f'[{self.room}] {self.user}'


# 익명 채팅 방 참여자
class BlindRoomMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=50)
    
    today = datetime.today().strftime("%Y%m%d")
    if not os.path.isdir(f'media/{today}/'):
        os.makedirs(f'media/{today}/')
    profile_img = models.ImageField(upload_to=f'{today}', null=True, blank=True)
    
    enter_time = models.DateTimeField(auto_now=True)
    exit_time = models.DateTimeField(auto_now=True)

    def __str__(self):
         return f'[{self.room}] {self.user}'


# 입력 창 잠금
class Lock(models.Model):
	room_id = models.ForeignKey(Room, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
