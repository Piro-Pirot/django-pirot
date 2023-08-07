import uuid
from django.db import models
from server.apps.local_users.models import User

# Create your models here.

# 채널
class Channel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    channel_name = models.CharField(max_length=64)
    channel_desc = models.TextField()
    channel_ok = models.IntegerField(default=0)
    channel_code = models.CharField(max_length=64, null=True, blank=True)
    # 개발자가 제공하는 기본 이미지를 지정
    default_image = models.ImageField(upload_to='default_profile/%Y%m%d', default='default_profile/default_profile.png', blank=True)

    def __str__(self):
         return f'[{self.channel_name}] {self.id}'


# 합격자
class Passer(models.Model):
    passer_name = models.CharField(max_length=64)
    passer_phone = models.CharField(max_length=64)
    level = models.IntegerField(default=1)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)

    def __str__(self):
         return f'[{self.channel}] {self.level}기 {self.passer_name}'


# 소속
class Join(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	passer = models.ForeignKey(Passer, on_delete=models.CASCADE)


# 운영진
class Staff(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)

    def __str__(self):
         return f'[{self.channel}] {self.user}'