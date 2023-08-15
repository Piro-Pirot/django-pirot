import json
from django.http import JsonResponse
from django.shortcuts import render, redirect
from .forms import SignupForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth
from server.apps.channels.models import Join, Staff, Channel
from django.http import JsonResponse
from .utils import make_signature
from .models import User, SMS_Auth
import requests, json, time
from django.views import View
from random import randint
from server.apps.channels.models import Staff, Channel, Join, Passer
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

def main(request):
    return render(request, "index.html")


def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            # auth.login(request, user)
            return redirect('/')
        else:
            return redirect('/user/signup/')
    else:
        form = SignupForm()
        context = {
            'form': form,
        }
        return render(request, template_name='users/signup.html', context=context)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            user = form.get_user()
            auth.login(request, user)
            # 현재 로그인 사용자의 소속 채널
            myJoinInfo = Join.objects.filter(user__name=request.user.name).first()
            if not myJoinInfo == None:
                return redirect(f'/room/{myJoinInfo.passer.channel.id}/main/')
            else:
                return redirect('/')
        else:
            context = {
                'form': form,
            }
            return render(request, template_name='index.html', context=context)
    else:
        form = AuthenticationForm()
        context = {
            'form': form,
        }
        return render(request, template_name='users/login.html', context=context)


def logout(request):
    auth.logout(request)
    return redirect('/')

# 일반회원 : 프로필 설정 페이지 / 운영진 : 운영진 페이지
def profile_setting(request, channelID):

    channel = Channel.objects.get(id=channelID)
    current_user = request.user

    # 운영진 여부
    if Staff.objects.filter(user=current_user).exists():
        url = '/staff/setting/%s' % (channelID)
        return redirect(url)

    if request.method == 'POST':
        if 'delete' in request.POST:
            current_user.profile_img.delete()
        elif 'change' in request.POST:
            if request.FILES.get('profile_img'):
                current_user.profile_img = request.FILES['profile_img']
        current_user.save()

        url = '/user/setting/%s' % (channelID)

        return redirect(url)

    if request.user.id == '491e61f0-f98b-43cd-b6df-90bedd90541e': # 기수가 없는 admin 예외 처리
        level = 0
    else:
        channelPasser = Passer.objects.filter(channel=channel, passer_name=current_user.name, passer_phone=current_user.phone_number).get()
        level = channelPasser.level

    context = {
        'user':current_user,
        'channel': channel,
        'level' : level,
    }
    
    return render(request, template_name='users/profilesetting.html', context=context)


def request_api(phone_num, auth_num):
    # 경과 시간을 millisecond로 나타냄
    # API Gateway 서버와 시간 차가 5분 이상 나는 경우 유효하지 않은 요청으로 간주
    timestamp = str(int(time.time()*1000))
    
    ACCESS_KEY = getattr(settings,'ACCESS_KEY') 
    URL = getattr(settings,'URL')
    URI = getattr(settings,'URI')
    
    # API 요청에 사용되는 암호화 문자열 생성
    message = "POST" + " " + URI + "\n" + timestamp + "\n" + ACCESS_KEY
    message = bytes(message, 'UTF-8')
    
    #디버깅
    print("URL:", URL)
    print("URI:", URI)
    print("Message: ", message)
    
    # API 요청의 무결성을 보장하기 위한 서명 값 생성
    # Body를 Access Key ID와 맵핑되는 Secret Key로 암호화한 서명값
    SIGNATURE = make_signature(message)
    
    #디버깅
    print("Signature: ", SIGNATURE)
    
    # API 요청에 필요한 헤더 정보 설정
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': ACCESS_KEY,
        'x-ncp-apigw-signature-v2': SIGNATURE
    }
    # SMS 메시지의 내용 및 수신자의 번호 등 정의한 객체
    body = {
        "type" : "SMS",
        "contentType" : "COMM",
        "from" : "01087118471",
        "content" : f"[Pirot] 인증번호 [{auth_num}]를 입력해주세요.",
        "messages" : [{
            "to" : f"{phone_num}"
        }]
    }
    # NCP(naver cloud platform) API에 POST 요청 -> 그러면 SMS 발송됨
    requests.post(URL, data=json.dumps(body), headers=headers)
    
    #디버깅
    print("request headers: ", headers)
    print("Request body: ", json.dumps(body))

# SMS 인증번호 생성 , 데이터 베이스에 저장한 후 SMS 발송하는 함수
def post(request):
    # http POST 요청으로 전달된 JSON 데이터를 파싱(JSON->python). 사용자가 입력한 휴대폰 번호가 포함되어있음.
    data = json.loads(request.body)
    try:
        check_phone_num = data['phone_num']
        sms_auth_num = randint(100000, 999999)
        auth_user = SMS_Auth.objects.get(phone_num=check_phone_num)
        auth_user.auth_num = sms_auth_num
        auth_user.save()
        request_api(phone_num=data['phone_num'], auth_num=sms_auth_num)
        return JsonResponse({'message' : '인증번호 발송완료'}, status=200)
    except SMS_Auth.DoesNotExist:
        SMS_Auth.objects.create(
            phone_num = check_phone_num,
            auth_num = sms_auth_num,
        ).save()
        request_api(phone_num=check_phone_num, auth_num=sms_auth_num)
        return JsonResponse({'message' : '인증번호 발송 및 DB 입력완료'}, status=200)

        
        

def sms_check(request):
    data = json.loads(request.body)
    user = User.objects.filter(phone_number=data['hypen_phone_num'])
    # 아이디 중복검사하기!
    # if len(user) == 1:
    #     return JsonResponse({'is_auth': False})
    # else:
    verification = SMS_Auth.objects.get(phone_num=data['phone_num'])
    if verification.auth_num == data['auth_num']:
        return JsonResponse({'is_auth': True})
    else:
        return JsonResponse({'is_auth' : False})
        
            


def start(request):
    return render(request, template_name="users/channel.html")

def channel_create(request):
    if request.method == 'POST':
        return render(request, template_name='users/channelCreateDone.html')
    else:
        return render(request, template_name='users/channelCreate.html')
    
def channel_code(request):
    if request.method == 'POST':
        pass
    else:
        return render(request, template_name='users/channelCode.html')
