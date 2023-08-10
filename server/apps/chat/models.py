from django.db import models
from server.apps.channels.models import Channel
from server.apps.local_users.models import User

# Create your models here.

# 채팅 방
class Room(models.Model):
    room_name = models.CharField(max_length=64)
    room_type = models.IntegerField(default=0)
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
    profile_img = models.CharField(max_length=50)
    enter_time = models.DateTimeField(auto_now=True)
    exit_time = models.DateTimeField(auto_now=True)

    def __str__(self):
         return f'[{self.room}] {self.user}'


# 입력 창 잠금
class Lock(models.Model):
	room_id = models.ForeignKey(Room, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
