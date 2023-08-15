# from django.db import models
from server.apps.chat.models import *

# Create your models here.

# 일반 말풍선
class Bubble(models.Model):
    CHAT = 0
    NOTICE = 1
    BUBBLE_TYPE = [
        (CHAT, 'CHAT'),
        (NOTICE, 'NOTICE')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    content = models.TextField()
    is_delete = models.IntegerField(default=0)
    read_cnt = models.IntegerField()
    file = models.FileField(null=True, blank=True)
    is_notice = models.IntegerField(choices=BUBBLE_TYPE, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user} - {self.room}'
    

# 익명 말풍선
class BlindBubble(models.Model):
    CHAT = 0
    NOTICE = 1
    BUBBLE_TYPE = [
        (CHAT, 'CHAT'),
        (NOTICE, 'NOTICE')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    content = models.TextField()
    is_delete = models.IntegerField(default=0)
    read_cnt = models.IntegerField()
    file = models.FileField(null=True, blank=True)
    is_notice = models.IntegerField(choices=BUBBLE_TYPE, default=0)

    # 익명성 보장
    nickname = models.CharField(max_length=32)
    profile_img = models.ImageField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user} - {self.room}'
