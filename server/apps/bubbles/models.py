# from django.db import models
from djongo import models
from server.apps.chat.models import Room
from server.apps.local_users.models import User

# Create your models here.

# 일반 말풍선
class Bubble(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    # room = models.ForeignKey(Room, on_delete=models.CASCADE)
    user = models.CharField(max_length=64)
    room = models.CharField(max_length=64)
    content = models.TextField()
    is_delete = models.IntegerField(default=0)
    read_cnt = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        app_label = "chatdb"
        db_table = 'bubble'
        abstract = True


# 첨부 파일 말풍선
class AttachBubble(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    # room = models.ForeignKey(Room, on_delete=models.CASCADE)
    user = models.CharField(max_length=64)
    room = models.CharField(max_length=64)
    file = models.CharField(max_length=64)
    isDelete = models.IntegerField(default=0)
    read_cnt = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        app_label = "chatdb"
        db_table = 'attach_bubble'
        abstract = True


class BubbleEntry(models.Model):
    bubble = models.EmbeddedField(
        model_container=Bubble,
    )

class AttachBubbleEntry(models.Model):
    attachBubble = models.EmbeddedField(
        model_container=AttachBubble,
    )