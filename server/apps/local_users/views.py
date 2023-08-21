import json
import random
import string
from django.http import JsonResponse
from django.shortcuts import render, redirect
from .forms import SignupForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth
from server.apps.channels.models import Join, Staff, Channel
from django.http import JsonResponse
from .models import User, SMS_Auth
import requests, json, time
from django.views import View
from random import randint
from server.apps.channels.models import Staff, Channel, Join, Passer
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import hashlib
import hmac
import base64, imghdr, os
from datetime import datetime
import re

from django.contrib.auth.hashers import check_password
from django.core.mail import EmailMessage

def main(request):
    return render(request, "index.html")

def username_check_ajax(request):
    req = json.loads(request.body)
    input_username = req['username']

    is_there_same_username = User.objects.filter(username=input_username)
    if len(is_there_same_username) or not input_username.encode().isalnum():
        return JsonResponse({'result': False})
    else:
        return JsonResponse({'result': True})


def signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        name = request.POST['name']
        password1 = request.POST['password1']
        password2 = request.POST['password2']
        phone_number = request.POST['phone_number']

        is_same_username = User.objects.filter(username=username)
        if len(is_same_username):
            return render(request, 'error.html', {'errorMsg': '아이디가 중복되었습니다.'})
        if password1 != password2:
            return render(request, 'error.html', {'errorMsg': '비밀번호가 다릅니다.'})
        
        # 비밀번호 제약 조건 확인
        PASSWORD_VALIDATION = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$'
        if not re.match(PASSWORD_VALIDATION, password1):
            return render(request, 'error.html', {'errorMsg': '비밀번호는 8자-16자, 특수문자[!@#$%^*+=-] 1개 이상, 숫자를 포함하여야 합니다.'})
        
        new_user = User.objects.create_user(
            username = username,
            name = name,
            password = password1,
            phone_number = phone_number
        )
        new_user.save()
        auth.login(request, new_user)
        return redirect('/')
    else:
        return render(request, 'users/signup.html')

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
            return render(request, 'error.html', { 'errorMsg': '일치하는 로그인 정보가 없습니다.' })
    else:
        return redirect('/')


def logout(request):
    auth.logout(request)
    return redirect('/')

# 일반회원 : 프로필 설정 페이지 / 운영진 : 운영진 페이지
def profile_setting(request, channelID):

    channel = Channel.objects.get(id=channelID)
    channelDefaultImg = channel.default_image
    current_user = request.user
    staffs = Staff.objects.filter(channel=channel)

    # 운영진 여부
    if staffs.filter(user=current_user).exists():
        url = '/staff/setting/%s' % (channelID)
        return redirect(url)

    channelPasser = Passer.objects.filter(channel=channel, passer_name=current_user.name, passer_phone=current_user.phone_number).get()

    # 업로드 이미지 파일명 변경
    if request.method == 'POST':
        if 'change' in request.POST:
            if request.FILES.get('profile_img'):
                inputImg = request.FILES['profile_img']

                today = datetime.today().strftime("%Y%m%d")

                # 디렉토리가 없으면 만들기
                if not os.path.isdir(f'media/{today}/'):
                    os.makedirs(f'media/{today}/')

                file_list = os.listdir(f'media/{today}')

                # 파일 쓰기
                with open(f'media/{today}/upload{len(file_list)}', 'wb') as output_file:
                    output_file.write(inputImg.read())

                filename = f'media/{today}/upload{len(file_list)}'

                img_type = imghdr.what(f'media/{today}/upload{len(file_list)}')

                if img_type != None:
                    os.rename(filename, f'{filename}.{img_type}')
                    inputImg = f'/{today}/upload{len(file_list)}.{img_type}'
                    current_user.profile_img = inputImg

        elif 'level' in request.POST:
            channelPasser.level = request.POST.get('level')
        current_user.save()
        channelPasser.save()

        url = '/user/setting/%s' % (channelID)

        return redirect(url)

    if request.user.username == 'admin': # 기수가 없는 admin 예외 처리
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

    secret_key = getattr(settings,'SECRET_KEY')
    secret_key = secret_key[1:len(secret_key)-2]
    secret_key = bytes(secret_key, 'UTF-8')
    
    SMS_SENDER = getattr(settings, 'SMS_SENDER')
    
    # API 요청의 무결성을 보장하기 위한 서명 값 생성
    # Body를 Access Key ID와 맵핑되는 Secret Key로 암호화한 서명값
    SIGNATURE = base64.b64encode(hmac.new(secret_key, message, digestmod=hashlib.sha256).digest())
    
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
        "from" : str(SMS_SENDER),
        "content" : f"[Pirot] 인증번호 [{auth_num}]를 입력해주세요.",
        "messages" : [{
            "to" : f"{phone_num}"
        }]
    }
    #디버깅
    print("sms_sender: ", SMS_SENDER)
    print("URL: ", URL)
    print("message: ", message)
    
    # NCP(naver cloud platform) API에 POST 요청 -> 그러면 SMS 발송됨
    requests.post(URL, data=json.dumps(body), headers=headers)

# SMS 인증번호 생성 , 데이터 베이스에 저장한 후 SMS 발송하는 함수
def sms_sender(request):
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
    if request.method == 'POST':
        data = json.loads(request.body)
        # user = User.objects.filter(phone_number=data['hypen_phone_num'])
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


# 전체 설정 모달

def preferences(request):
    if request.method == 'POST':
        channel_id = request.POST.get('channelId')
        curUserObj = request.user
        if request.POST.get('theme'):
             # 아무것도 선택하지 않는 경우는 안 됨
            checkedTheme = request.POST.get('theme')
            curUserObj.theme = str(checkedTheme)
            curUserObj.save()
        if request.POST.get('alarm'):
            checkedAlarm = request.POST.get('alarm')
            curUserObj.notice = int(checkedAlarm)
            curUserObj.save()
        else:
            curUserObj.notice = 0
            curUserObj.save()

        return redirect(f'/room/{channel_id}/main/')
    
def update_phone_ajax(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        new_phone = req['new_phone']

        # 전화번호 제약 조건 확인
        PHONE_VALIDATION = r'/?([0-9]{3})-?([0-9]{4})-?([0-9]{4})'
        if not re.match(PHONE_VALIDATION, new_phone):
            return JsonResponse({'result': False})
        else:
            # 입력 값이 정확할 때
            request.user.phone_number = new_phone
            request.user.save()

            # Passer 정보 모두 수정
            my_passer_info = Passer.objects.filter(passer_name=request.user.name)
            for info in my_passer_info:
                info.passer_phone = new_phone
                info.save()

            return JsonResponse({'result': True})
    

def update_pw_ajax(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        old_pw = req['old_pw']
        new_pw = req['new_pw']

        # 비밀번호 제약 조건 확인
        PASSWORD_VALIDATION = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$'
        if not check_password(old_pw, request.user.password):
            print('password not matched!')
            return JsonResponse({'result': False})
        elif not re.match(PASSWORD_VALIDATION, new_pw):
            print('password not matched!')
            return JsonResponse({'result': False})
        else:
            # 입력 값이 정확할 때
            request.user.set_password(new_pw)
            request.user.save()
            auth.login(request, request.user, backend='django.contrib.auth.backends.ModelBackend')

            return JsonResponse({'result': True})


def lost_pw(request):
    if request.method == 'POST':
        lost_email = request.POST['lost-pw-email']
        lost_id = request.POST['lost-id']

        # 이메일 정규식
        EMAIL_VALIDATION = r'^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$'
        if not re.match(EMAIL_VALIDATION, lost_email):
            return render(request, 'error.html', {'errorMsg': '입력하신 이메일의 형식이 잘못되었습니다.'})
        
        alphabet_list = string.ascii_letters
        digits_list = string.digits
        punctuation_list = string.punctuation

        new_tem_password = random.sample(alphabet_list, 8) + random.sample(digits_list, 5) + random.sample(punctuation_list, 3)
        random.shuffle(new_tem_password)
        new_tem_password = ''.join(new_tem_password)
        
        try:
            lost_user = User.objects.get(username=lost_id)
            lost_user.set_password(new_tem_password)
            lost_user.save()
        except User.DoesNotExist:
            return render(request, 'error.html', {'errorMsg': '입력하신 아이디에 해당하는 회원 정보가 존재하지 않습니다.'})

        
        email = EmailMessage(
            f'[Pirot] 🥕새로운 비밀번호입니다!🐇',
            f'''
            <p style="font-size: 1rem; font-weight: 500;">비밀번호가 갱신되었습니다.</p>
            <p>🔐 {lost_id}님의 새로운 비밀번호는 아래와 같습니다.</p>
            <p style="font-size: 1rem;">{new_tem_password}</p>
            <p>보안을 위해 회원님의 비밀번호를 꼭 재설정하세요.</p>
            <a href='https://hello.pirot.p-e.kr'>
            <p style="font-size: 1rem;">Pirot에서 다시 로그인하기</p>
            </a>
            ''',
            to=[lost_email],
        )
        email.content_subtype = "html"
        if not email.send():
            print('error!')

        return redirect('/')

# 회원 탈퇴   
def unregister(request):
    msg = ''

    # 즉시 회원 탈퇴가 불가능한 경우
    # 멤버가 본인 하나뿐인 경우 -> 채널 자동 삭제 후 탈퇴
    # 해당 회원이 속한 모든 채널을 탐색 -> 하나라도 조건을 만족하면 에러
    channels = Channel.objects.all()
    for channel in channels:
        count = 0
        channelPassers = channel.passer_set.all()
        for channelPasser in channelPassers:
            if channelPasser.join_set.all().exists():
                count += 1
                lastJoiner = channelPasser
        if count == 1: # 채널에 join이 1명일 때
            if lastJoiner.join_set.filter(user=request.user).exists():
                return render(request, 'users/onlyOneJoinError.html', {'channel':channel}) # 에러 페이지

    # 운영진이 본인 하나뿐인 경우 -> 해당 채널 운영진 위임 권유 (한번에 하나의 채널만 반환)
    for channel in channels:
        channelStaffs = Staff.objects.filter(channel=channel)
        if channelStaffs.count() == 1:
            if channelStaffs.filter(user=request.user).exists():
                return render(request, 'users/onlyOneStaffError.html', {'channel':channel}) # 에러 페이지


    if request.method == 'POST':
        inputID = request.POST.get('userID')
        inputPW = request.POST.get('userPW')

        if inputID == request.user.username and check_password(inputPW, request.user.password):
            request.user.delete()

            return redirect('/user/byebye/')
        else:
            msg = '정보가 일치하지 않습니다.'

            return render(request, 'users/unregister.html', {'username': request.user.name, 'msg':msg})

    return render(request, 'users/unregister.html', {'username': request.user.name, 'msg':msg})

# 회원 탈퇴 완료
def byebye(request):
    return render(request, 'users/byebye.html')