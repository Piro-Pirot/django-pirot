from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.

# 카카오 소셜 로그인 사용자
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=20)
    profile_img = models.ImageField(blank=True, upload_to="posts/%Y%m%d")
    class Meta:
        app_label = 'local_users' 
    


# 회원 즐겨찾기
class Bookmark(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
	bookmarked_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarked_user')