from django.shortcuts import render, redirect
from .models import Passer, Join, Staff
import random
import string
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


# 합격자 명단 추가 : 기수 작성
def passer_create_level(request):
    # 채널 정보를 받아와야 함!!!! 랜딩페이지부터 쭉쭉 받아와야할 듯(직전 단계는 어디?)
    # 일단 get방식으로 받는다고 생각
    channel = request.GET.get("channel")

    if request.method == "POST":
        level = request.POST["level"]
        url = '/staff/passer_create/?level=%s&channel=%s' % (level, channel)

        return redirect(url)
    
    return render(request, "#")


#  합격자 명단 추가 : 이름, 전화번호 등록
def passer_create(request):
    level = request.GET.get("level")
    channel = request.GET.get("channel")
    url = '/staff/passer_create/?level=%s&channel=%s' % (level, channel)

    if request.method == "POST":
        Passer.objects.create(
            passer_name = request.POST["name"],
            passer_phone = request.POST["phone"],
            level = level,
            channel = channel,
        )
        return redirect(url)
    
    return render(request, "#")


# 참여 코드 생성
def code_create(request):
    channel = request.GET.get("channel")

    alphabet_list = string.ascii_letters
    digits_list = string.digits
    sample_list = alphabet_list + digits_list

    # 이미 참여 코드가 있는 경우
    if channel.channel_code:
        code = channel.channel_code
    

    # 참여 코드 생성
    if request.method == "POST":
        random_list = random.sample(sample_list,6)
        code = ''.join(random_list)
        channel.channel_code = code

        return redirect("/staff/code_create/")

    # code를 생성하지 않은 상태이면 "" 전달
    return render(request, "#", {"code":code if code is not None else ""})


# 동아리 기본 설정
def default_profile(request):
    channel = request.GET.get("channel")
    default_image = channel.get_default_image() # 모델 수정 필요

    if request.method == "POST":
        image = request.POST["image"]
        channel.defalut_image = image # 모델 수정 필요

        return redirect("/staff/channel/setting/?channel=%s")
    
    return render(request, "#", {"default_image":default_image})


# 운영진 권한 설정
@csrf_exempt
def staff_onoff(request):
    joins = Join.objects.all()
    staffs = Staff.objects.all()

    # toggle() 사용 on/off ajax
    # js : 버튼 on/off 조작 ... 완료 ! -> 저장 POST
    # -> if 버튼이 on인 회원 객체가 staff 목록에 없으면 추가
    #    if 버튼이 off인 회원 객체가 staff 목록에 있으면 삭제
    # -> staff.save() 이건 view에서?

    return render(request, "#", {"joins":joins, "staffs":staffs})


# 회원 삭제
def join_delete(request):
    joins = Join.objects.all()

    if request.method == "POST":
        user = request.POST['user']
        join = Join.objects.get(user=user)
        join.delete() # 회원 삭제
        passer = Passer.objects.get(passer_name=user.name)
        passer.delete() # 합격자 명단에서도 삭제

        return redirect("/staff/passer_delete/")

    return render(request, "#", {"joins":joins}) # 회원 실명, 기수 참조 가능

# 프로필 사진 변경
def profile_setting(request):
    current_user = request.user

    if request.method == "POST":
        current_user.profile_img = request.POST["profile_img"]
        current_user.save()

        return redirect("/user/setting/") # 프로필 설정 페이지에 머무름
    
    return render(request, "#", {"user":current_user})