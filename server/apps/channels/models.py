from django.db import models
from server.apps.local_users.models import User

# Create your models here.

# 채널
class Channel(models.Model):
    NO = 0
    YES = 1
    IS_APPROVE = [
         (NO, 'NO'),
         (YES, 'YES')
    ]
    channel_name = models.CharField(max_length=64)
    channel_desc = models.TextField()
    channel_ok = models.IntegerField(choices=IS_APPROVE, default=0)
    channel_code = models.CharField(max_length=64, null=True, blank=True)
    # 개발자가 제공하는 기본 이미지를 지정
    default_image = models.ImageField(upload_to='default_profile/%Y%m%d', default='default_profile/default_profile.png', blank=True)
    this_level = models.IntegerField(default=0, null=True, blank=True)

    def __str__(self):
         return f'[{self.channel_name}] {self.id}'


# 합격자
class Passer(models.Model):
    passer_name = models.CharField(max_length=64)
    passer_phone = models.CharField(max_length=64)
    level = models.IntegerField(default=1)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)

    def __str__(self):
         return f'{self.level}기 {self.passer_name}'


# 소속
class Join(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='join')
	passer = models.ForeignKey(Passer, on_delete=models.CASCADE)


# 운영진
class Staff(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)

    def __str__(self):
         return f'[{self.channel}] {self.user}'


# 회원 즐겨찾기
class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmark_user', null=True)
    bookmarked_user = models.ForeignKey(Passer, on_delete=models.CASCADE, related_name='bookmarked_user', null=True)
    
    def __str__(self):
       return f'[{self.user}] {self.bookmarked_user}'