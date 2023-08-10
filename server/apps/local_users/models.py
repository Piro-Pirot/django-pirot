from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

# 카카오 소셜 로그인 사용자
class User(AbstractUser):
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    # phone_num = models.CharField(verbose_name='휴대폰 번호', max_length=13) # 첫번째 매개변수 : (사용자 인터페이스에 표시되는) 필드의 이름
    # auth_num = models.CharField(verbose_name='인증번호',  max_length=13)
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
   
#  sms 인증
class SMS_Auth(models.Model):
    phone_num = models.CharField(verbose_name='휴대폰 번호', max_length=20) # 첫번째 매개변수 : (사용자 인터페이스에 표시되는) 필드의 이름
    auth_num = models.CharField(verbose_name='인증번호',  max_length=10, null=True)
    
#     class Meta :
#         db_table = 'authentications' 
#         # 관리자 페이지에서 모델의 이름 표시
#         verbose_name_plural = "휴대폰인증 관리 페이지"