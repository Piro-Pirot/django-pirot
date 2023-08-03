from django.shortcuts import render, redirect
from django.conf import settings
from local_users.models import User
from allauth.socialaccount.models import SocialAccount
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.http import JsonResponse
import requests
from rest_framework import status
from json.decoder import JSONDecodeError

def kakao_login(request):
    rest_api_key = getattr(settings,'KAKAO_REST_API_KEY')
    redirect_uri = "http://localhost:8000/kakao/callback"
    # 인가코드 요청하기
    return redirect(f"https://kauth.kakao.com/oauth/authorize?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code")

def kakao_callback(request):
    rest_api_key = getattr(settings,'KAKAO_REST_API_KEY')
    code = request.GET.get("code")
    redirect_uri = "http://localhost:8000/kakao/callback"
    """
    Access Token Request
    """
    token_req = requests.get(
        f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={rest_api_key}&redirect_uri={redirect_uri}&code={code}")
    token_req_json = token_req.json()
    error = token_req_json.get("error")
    if error is not None:
        raise JSONDecodeError(error)
    access_token = token_req_json.get("access_token")
    """
    Email Request
    
    access token으로 email값을 요청
    """
    profile_request = request.get(
        "https://kapi.kakao.com/v2/user/me", headers = {"Authorization": f"Bearer {access_token}"}
    )
    profile_json = profile_request.json()
    kakao_account = profile_json.get('kakao_account')
    """
    kakao_account에서 이메일 외에
    카카오톡 프로필 이미지, 배경 이미지 url 가져올 수 있음
    print(kakao_account) 참고
    (일단은 email만)
    """
    # print(kakao_account)
    email = kakao_account.get('email')
    
    """
    Signup or Signin Request
    """
    try:
        user = User.objects.get(email=email)
        # 기존에 가입된 유저의 Provider가 kakao가 아니면 에러 발생, 맞으면 로그인
        # 다른 SNS로 가입된 유저
        social_user = SocialAccount.objects.get(user=user)
        if social_user is None:
            return JsonResponse({'err_msg': 'email exists but not social user'}, status=status.HTTP_400_BAD_REQUEST)
        if social_user.provider != 'kakao':
            return JsonResponse({'err_msg': 'no matching social type'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        # 기존에 가입된 유저가 없으면 새로 가입
        data = {'access_token': access_token, 'code': code}
        accept = requests.post(
            f"{BASE_URL}accounts/kakao/login/finish/", data=data)
        accept_status = accept.status_code
        if accept_status != 200:
            return JsonResponse({'err_msg': 'failed to signup'}, status=accept_status)
        # 여기서 발견한 문제점 : 카카오 소셜 로그인으로 전화번호를 가져오려면 사업자번호가 있어야한다!
        #  그래서 결론 : 카카오 바이바이~