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
            # 현재 로그인 사용자의 소속 채널
            myJoinInfo = Join.objects.filter(user__name=request.user.name).first()
            return redirect(f'/room/{myJoinInfo.passer.channel.channel_name}/main/')
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
        return render(request, template_name='users/base.html', context=context)


def logout(request):
    auth.logout(request)
    return redirect('/')

# 일반회원 : 프로필 설정 페이지 / 운영진 : 운영진 페이지
def profile_setting(request):

    channel = Channel.objects.get(channel_name="피로그래밍") # 임시!! 위에 모델 임포트도 지우기 나중에
    current_user = request.user

    # 운영진 여부
    if Staff.objects.filter(user=current_user).exists():
        return redirect('/staff/setting/')

    if request.method == 'POST':
        if 'delete' in request.POST:
            current_user.profile_img.delete()
        elif 'change' in request.POST:
            current_user.profile_img = request.FILES['profile_img']
        current_user.save()

        return redirect('/user/setting/') # 프로필 설정 페이지에 머무름
    
    # if current_user.profile_img and hasattr(current_user.profile_image):
    #     profile_image = current_user.profile_img.url
    # else:
    #     profile_image = channel.default_image.url

    context = {
        'user':current_user,
        # 'profile_image':profile_image,
        'channel': channel,
    }
    
    return render(request, 'users/profilesetting.html', context=context)

class SMS_send(View):
    def request_api(self, phone_num, auth_num):
        # 경과 시간을 millisecond로 나타냄
        # API Gateway 서버와 시간 차가 5분 이상 나는 경우 유효하지 않은 요청으로 간주
        timestamp = str(int(time.time()*1000))
        
        ACCESS_KEY = "3E4qKWxpP3BueLZUKh9V"	
        URL = "https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:285290282105:pirot_sms_auth/messages"
        URI = "/sms/v2/services/ncp:sms:kr:285290282105:pirot_sms_auth/messages"
        
        # API 요청에 사용되는 암호화 문자열 생성
        message = "POST" + " " + URI + "\n" + timestamp + "\n" + ACCESS_KEY
        message = bytes(message, 'UTF-8')
        
        # API 요청의 무결성을 보장하기 위한 서명 값 생성
        # Body를 Access Key ID와 맵핑되는 Secret Key로 암호화한 서명값
        SIGNATURE = make_signature(message)
        
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
            "content" : f"[테스트] 인증번호 [{auth_num}]를 입력해주세요.",
            "messages" : [{
                "to" : f"{phone_num}"
            }]
        }
        # NCP(naver cloud platform) API에 POST 요청 -> 그러면 SMS 발송됨
        requests.post(URL, data=json.dumps(body), headers=headers)
    
    # SMS 인증번호 생성 , 데이터 베이스에 저장한 후 SMS 발송하는 함수
    def send_sms(self,request):
        # http POST 요청으로 전달된 JSON 데이터를 파싱(JSON->python). 사용자가 입력한 휴대폰 번호가 포함되어있음.
        data = json.loads(request.body)
        try:
            check_phone_num = data['phone_num']
            sms_auth_num = randint(100000, 999999)
            auth_user = SMS_Auth.objects.get(phone_num=check_phone_num)
            auth_user.auth_num = sms_auth_num
            auth_user.save()
            self.request_api(phone_num=data['phone_num'], auth_num=sms_auth_num)
            return JsonResponse({'message' : '인증번호 발송완료'}, status=200)
        except SMS_Auth.DoesNotExist:
            SMS_Auth.objects.create(
                phone_num = check_phone_num,
                auth_num = sms_auth_num,
            ).save()
            self.request_api(phone_num=check_phone_num, auth_num=sms_auth_num)
            return JsonResponse({'message' : '인증번호 발송 및 DB 입력완료'}, status=200)
        
        

class SMS_check(View):
    def post(self, request):
        data = json.loads(request.body)
        try:
            verification = SMS_Auth.objects.get(phone_num=data['phone_num'])
            if verification.auth_num == data['auth_num']:
                return JsonResponse({'message' : "인증 성공"}, status=200)
            else:
                return JsonResponse({'message' : '인증 실패'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'message' : '해당 휴대폰 번호가 존재하지 않습니다.'}, status=400)
            