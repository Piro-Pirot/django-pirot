from django.shortcuts import render, redirect
from .forms import SignupForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth
from django.http import JsonResponse
import requests, json, time
from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.views import APIView
from .models import SMS_Auth
from django.views import View
from random import randint
from .utils import make_signature


def main(request):
    return render(request, "index.html")


def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            auth.login(request, user)
            return redirect('/')
        else:
            return redirect('/user/signup/')
    else:
        form = SignupForm()
        context = {
            'form': form,
        }
        return render(request, template_name='users/signup.html', context=context)


def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            user = form.get_user()
            auth.login(request, user)
            return redirect('/')
        else:
            context = {
                'form': form,
            }
            return render(request, template_name='users/login.html', context=context)
    else:
        form = AuthenticationForm()
        context = {
            'form': form,
        }
        return render(request, template_name='users/login.html', context=context)


def logout(request):
    auth.logout(request)
    return redirect('/')

class SMS_send(View):
    def make_num(self, *args, **kwargs):
        self.auth_num = randint(100000, 999999)
        super().save(*args, **kwargs)
        self.send_sms()
     
    def send_sms(self):
        timestamp = str(int(time.time()*1000))
        ACCESS_KEY = "3E4qKWxpP3BueLZUKh9V"	
        URL = "https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:285290282105:pirot_sms_auth/messages"
        URI = "/sms/v2/services/ncp:sms:kr:285290282105:pirot_sms_auth/messages"
        # 암호화 문자열 생성
        message = "POST" + " " + URI + "\n" + timestamp + "\n" + ACCESS_KEY
        message = bytes(message, 'UTF-8')
        
        SIGNATURE = make_signature(message)
        
        headers = {
            "Content-Type": "application/json; charset=utf-8",
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-iam-access-key': ACCESS_KEY,
            'x-ncp-apigw-signature-v2': make_signature(timestamp)
        }
        body = {
            "type" : "SMS",
            "contentType" : "COMM",
            "from" : "01087118471",
            "content" : "[테스트] 인증번호 [{}]를 입력해주세요.".format(self.auth_num),
            "messages" : [{
                "to" : [self.phone_num]
            }]
        }
        requests.post(URL, data=json.dumps(body), headers=headers)
        

class SMS_check_view(View):
    def post(self, request):
        data = json.loads(request.body)
        try:
            verification = SMS_Auth.objects.get(phone_num=data['phone_num'])
            if verification.auth_num == data['auth_num']:
                return JsonResponse({'message' : "인증 성공"}, status=200)
            else:
                return JsonResponse({'message' : '인증 실패'}, status=400)
        except SMS_Auth.DoesNotExist:
            return JsonResponse({'message' : '해당 휴대폰 번호가 존재하지 않습니다.'}, status=400)
            
            
