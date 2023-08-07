from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
import requests, json, time
from random import randint
from .utils import make_signature


# Create your models here.

# 카카오 소셜 로그인 사용자
class User(AbstractUser):
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
 
#  sms 인증
class SMS_Auth(models.Model):
    phone_num = models.CharField(verbose_name='휴대폰 번호', max_length=13) # 첫번째 매개변수 : (사용자 인터페이스에 표시되는) 필드의 이름
    auth_num = models.CharField(verbose_name='인증번호',  max_length=13)
    
    class Meta :
        db_table = 'authentications' 
        # 관리자 페이지에서 모델의 이름 표시
        verbose_name_plural = "휴대폰인증 관리 페이지"
    
    # def make_num(self, *args, **kwargs):
    #     self.auth_num = randint(100000, 999999)
    #     super().save(*args, **kwargs)
    #     self.send_sms()
     
    # def send_sms(self):
    #     timestamp = str(int(time.time()*1000))
    #     ACCESS_KEY = "3E4qKWxpP3BueLZUKh9V"	
    #     URL = "https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:285290282105:pirot_sms_auth/messages"
    #     URI = "/sms/v2/services/ncp:sms:kr:285290282105:pirot_sms_auth/messages"
    #     # 암호화 문자열 생성
    #     message = "POST" + " " + URI + "\n" + timestamp + "\n" + ACCESS_KEY
    #     message = bytes(message, 'UTF-8')
        
    #     SIGNATURE = make_signature(message)
        
    #     headers = {
    #         "Content-Type": "application/json; charset=utf-8",
    #         'x-ncp-apigw-timestamp': timestamp,
    #         'x-ncp-iam-access-key': ACCESS_KEY,
    #         'x-ncp-apigw-signature-v2': make_signature(timestamp)
    #     }
    #     body = {
    #         "type" : "SMS",
    #         "contentType" : "COMM",
    #         "from" : "01087118471",
    #         "content" : "[테스트] 인증번호 [{}]를 입력해주세요.".format(self.auth_num),
    #         "messages" : [{
    #             "to" : [self.phone_num]
    #         }]
    #     }
    #     requests.post(URL, data=json.dumps(body), headers=headers)
        
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
    bookmarked_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarked_user')
    
    def __str__(self):
       return f'[{self.user}] {self.bookmarked_user}'