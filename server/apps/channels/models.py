from django.db import models
from server.apps.local_users.models import User

# Create your models here.

# 채널
class Channel(models.Model):
	channel_name = models.CharField(max_length=64)
	channel_desc = models.CharField(max_length=64)
	channel_ok = models.IntegerField()
	channel_code = models.CharField(max_length=64)


# 합격자
class Passer(models.Model):
    passer_name = models.CharField(max_length=64)
    passer_phone = models.CharField(max_length=64)
    level = models.IntegerField(default=1)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
	

# 운영진
class Staff(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)