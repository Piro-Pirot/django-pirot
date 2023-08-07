import uuid
from django.db import models
from server.apps.channels.models import Channel
from server.apps.local_users.models import User

# Create your models here.

# 채팅 방
class Room(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room_name = models.CharField(max_length=64)
    room_type = models.IntegerField()
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)


# 채팅 방 참여자
class RoomMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    enter_time = models.DateTimeField(auto_now=True)
    exit_time = models.DateTimeField(auto_now=True)


# 익명 채팅 방 참여자
class BlindRoomMember(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    nickname = models.CharField(max_length=50)
    profile_img = models.CharField(max_length=50)
    enter_time = models.DateTimeField(auto_now=True)
    exit_time = models.DateTimeField(auto_now=True)


# 입력 창 잠금
class Lock(models.Model):
	room_id = models.ForeignKey(Room, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.CASCADE)