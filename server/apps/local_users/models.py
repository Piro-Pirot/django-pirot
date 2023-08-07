from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.

# 카카오 소셜 로그인 사용자
class User(AbstractUser):
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=20)
    name = models.CharField(max_length=20)
    profile_img = models.ImageField(null=True, blank=True, upload_to="posts/%Y%m%d")
    notice = models.IntegerField(default=0)
    theme = models.CharField(max_length=16, default='#ffffff')
    
    def __str__(self):
          return self.username


# 회원 즐겨찾기
class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
    bookmarked_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarked_user')
    
    def __str__(self):
       return f'[{self.user}] {self.bookmarked_user}'