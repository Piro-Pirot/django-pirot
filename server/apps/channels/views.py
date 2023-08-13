from django.shortcuts import render, redirect
from .models import *
import random
import string
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

def index(request):
    myJoinInfo = ''
    
    if request.user.is_authenticated:
        myJoinInfo = Join.objects.filter(user=request.user)
    
    return render(request, 'index.html', {
        'myJoinInfo': myJoinInfo
    })

# 운영진 : 운영진 페이지
def profile_staff(request, channelID):

    channel = Channel.objects.get(id=channelID) # 임시!! 위에 모델 임포트도 지우기 나중에
    current_user = request.user

    if request.method == 'POST':
        if 'delete' in request.POST:
            current_user.profile_img.delete()
        elif 'change' in request.POST:
            if request.FILES.get('profile_img'):
                current_user.profile_img = request.FILES.get('profile_img')
        current_user.save()

        url = '/staff/setting/%s' % (channelID)

        return redirect(url) # 프로필 설정 페이지에 머무름
    
    channelPasser = Passer.objects.filter(channel=channel, passer_name=current_user.name, passer_phone=current_user.phone_number).get()
    level = channelPasser.level

    context = {
        'user':current_user,
        'channel': channel,
        'level' : level
    }
    
    return render(request, 'staff/staff_profile.html', context=context)


# 합격자 명단 추가 : 기수 작성
def passer_create_level(request, channelID):
    # 채널 정보를 받아와야 함!!!! 랜딩페이지부터 쭉쭉 받아와야할 듯(직전 단계는 어디?)
    # 일단 get방식으로 받는다고 생각
    channel = Channel.objects.get(id=channelID)
    passers = Passer.objects.filter(channel=channel)

    if request.method == "POST":
        level = request.POST["level"]
        url = '/staff/passer_create/passer/%s/?level=%s' % (channelID, level)

        return redirect(url)
    
    return render(request, 'staff/passerlevel.html', {"channel":channel, "passers":passers})


#  합격자 명단 추가 : 이름, 전화번호 등록
def passer_create(request, channelID):
    level = request.GET.get("level")
    channel = Channel.objects.get(id=channelID)
    passers = Passer.objects.filter(channel=channel)
    
    if request.method == "POST":
        if 'save' in request.POST:
            Passer.objects.create(
                passer_name = request.POST["name"],
                passer_phone = request.POST["phone"],
                level = level,
                channel = channel,
            )
            url = '/staff/passer_create/level/%s/' % (channelID)

            return redirect(url)

        elif 'keepgoing' in request.POST:
            Passer.objects.create(
                passer_name = request.POST["name"],
                passer_phone = request.POST["phone"],
                level = level,
                channel = channel,
            )
            url = '/staff/passer_create/passer/%s/?level=%s' % (channelID, level)

            return redirect(url)
    
    return render(request, 'staff/passer.html', {"channel":channel, "passers":passers})


# 참여 코드 생성
def code_create(request, channelID):
    channel = Channel.objects.get(id=channelID)

    alphabet_list = string.ascii_letters
    digits_list = string.digits
    sample_list = alphabet_list + digits_list

    # 이미 참여 코드가 있는 경우
    if channel.channel_code:
        code = channel.channel_code
    else:
        code = ""
    
    # 참여 코드 생성
    if request.method == "POST":
        random_list = random.sample(sample_list,6)
        created_code = ''.join(random_list)
        channel.channel_code = created_code
        channel.save()
        code = channel.channel_code
        print(code)

        url = '/staff/code_create/%s/' % (channelID)

        return redirect(url)

    # code를 생성하지 않은 상태이면 "" 전달
    return render(request, 'staff/code_create.html', {"code":code, "channel":channel})


# 동아리 기본 설정
def default_profile(request, channelID):
    channel = Channel.objects.get(id=channelID)

    if request.method == "POST":
        if request.FILES.get("default_image"):
            channel.default_image = request.FILES["default_image"]
            channel.save()

        if request.POST.get("this_level"):
            channel.this_level = request.POST["this_level"]
            channel.save()
        
        url = '/staff/channel/setting/%s' % (channelID)

        return redirect(url)
    
    return render(request, 'staff/default_profile.html', {"channel":channel})


# 운영진 권한 설정
def staff_authority(request, channelID):
    # joins = Join.objects.all() 얘를 쓴 이유가 처음에 뭐였을까?
    staffs = Staff.objects.all()
    channel = Channel.objects.get(id=channelID)
    thislevelPassers = Passer.objects.filter(channel=channel, level=channel.this_level)

    # toggle() 사용 on/off ajax
    # js : 버튼 on/off 조작 ... 완료 ! -> 저장 POST
    # -> if 버튼이 on인 회원 객체가 staff 목록에 없으면 추가
    #    if 버튼이 off인 회원 객체가 staff 목록에 있으면 삭제
    # -> staff.save() 이건 view에서?

    return render(request, 'staff/staff_authority.html', {"staffs":staffs, "channel":channel, "thislevelPassers":thislevelPassers})


# 회원 삭제
@csrf_exempt
def join_delete(request, channelID):
    joins = Join.objects.all()
    channel = Channel.objects.get(id=channelID)

    if request.method == "POST":
        user = request.POST['user']
        print(user)
        join = Join.objects.get(user=user)
        join.delete() # 회원 삭제
        passer = Passer.objects.get(passer_name=user.name)
        passer.delete() # 합격자 명단에서도 삭제

        return redirect("/staff/join_delete/%s") % (channelID)

    return render(request, 'staff/join_delete.html', {"joins":joins, "channel":channel}) # 회원 실명, 기수 참조 가능



# 즐겨찾기
def bookmark(request):
    if request.method == 'POST' and request.user.is_authenticated:
        req = json.loads(request.body)
        user = request.user
        curChannel = Channel.objects.get(id=req['channelId'])
        target = req['target']
        target_passer = Passer.objects.get(passer_name=target, channel=curChannel)

        try:
            # 즐겨찾기 되어 있으면 취소
            Bookmark.objects.get(user=user, bookmarked_user=target_passer).delete()
            return JsonResponse({'type': 'deleted'})
        except:
            # 즐겨찾기 하기
            Bookmark.objects.create(
                user = user,
                bookmarked_user = target_passer
            ).save()

            return JsonResponse({'type': 'added'})
    

def start(request):
    return render(request, template_name="users/channel.html")

def channel_create(request):
    if request.method == 'POST':
        new_channel = Channel.objects.create(
            channel_name = request.POST['channel-create-name'],
            channel_desc = request.POST['channel-create-desc']
        )
        new_channel.save()
        
        # Passer와 Join에 신청자 추가
        new_passer = Passer.objects.create(
            passer_name = request.user.name,
            passer_phone = request.user.phone_number,
            channel = new_channel
        )
        new_passer.save()
        Join.objects.create(
            user = request.user,
            passer = new_passer
        ).save()

        return render(request, template_name='users/channelCreateDone.html')
    else:
        return render(request, template_name='users/channelCreate.html')
    
def channel_code(request):
    if request.method == 'POST':
        req_code = request.POST['channel-code-input']
        try:
            channel_info = Channel.objects.get(channel_code=req_code)
            passer_info = Passer.objects.filter(passer_name=request.user.name, channel=channel_info)[0]
        except:
            return render(request, template_name='error.html', context={'errorMsg': '입력하신 정보에 오류가 있습니다.'})

        if channel_info and passer_info:
            Join.objects.create(
                user = request.user,
                passer = passer_info
            ).save()
            return redirect(f'/room/{channel_info.id}/friends/')
        else:
            return render(request, template_name='error.html', context={'errorMsg': '회원님의 참여 코드와 일치하는 소속된 채널이 없습니다.'})
    else:
        return render(request, template_name='users/channelCode.html')