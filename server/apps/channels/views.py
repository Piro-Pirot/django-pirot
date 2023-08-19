from django.shortcuts import render, redirect
from .models import *
import random
import string
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .searchHangul import *

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
    
    return render(request, 'staff/passerlevel.html', {"channel":channel})


#  합격자 명단 추가 : 이름, 전화번호 등록
def passer_create(request, channelID):
    level = request.GET.get("level")
    channel = Channel.objects.get(id=channelID)
    passers = Passer.objects.filter(channel=channel, level=level)
    
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
    
    return render(request, 'staff/passer.html', {"channel":channel, "passers":passers, "level":level})


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
    channel = Channel.objects.get(id=channelID)
    thisjoins = Join.objects.filter(passer__channel=channel) # 얘를 쓴 이유가 처음에 뭐였을까? 아.. User 모델이 여기에만 연결되어 있음(고유성)
    staffs = Staff.objects.filter(channel=channel)
    staffPassers = staffs.only('user')
    staffPassers = list(staffPassers.values_list('user__username', flat=True))

    
    thislevelPassers = Passer.objects.filter(channel=channel, level=channel.this_level)

    # 원래 저장 상태 불러오기

    if request.method == 'POST':
        if request.POST.get('checked'):
            staffs.delete() # 아무것도 선택하지 않는 경우는 안 됨
            for checked in request.POST.getlist('checked'):
                name, phone = checked.split(' ')
                passerObj = thislevelPassers.get(passer_name=name, passer_phone=phone)
                userObj = thisjoins.get(passer=passerObj).user
                if staffs.filter(user=userObj).count() == 0:
                    newStaff = Staff.objects.create(
                        user = userObj,
                        channel = channel
                    )
                    newStaff.save()
        url = '/staff/staff_authority/%s' % (channelID)

        return redirect(url)


    return render(request, 'staff/staff_authority.html', {"channel":channel, "staffs":staffPassers, "thisjoins":thisjoins, "thislevelPassers":thislevelPassers})


# 회원 삭제
def join_delete(request, channelID):
    joins = Join.objects.all()
    channel = Channel.objects.get(id=channelID)
    channelPassers = Passer.objects.filter(channel=channel)

    if request.method == "POST":
        passerId = request.POST.get('passerId')
        passer = Passer.objects.get(id=passerId)
        try:
            join = Join.objects.get(passer=passer)
            join.delete() # 동아리 회원이면 회원 삭제
            passer.delete() # 합격자 명단에서도 삭제
        except:
            passer.delete() # 아직 가입하지 않은 경우, 합격자 명단에서만 삭제     

        url = '/staff/join_delete/%s' % (channelID)
        
        return redirect(url)

    return render(request, 'staff/join_delete.html', {"channel":channel, "channelPassers":channelPassers}) # 회원 실명, 기수 참조 가능



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


# 친구 검색
def search_friends_ajax(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        channel_id = req['channelId']
        curChannel = Channel.objects.get(id=channel_id)
        search_input_value = req['inputValue']

        # 나를 제외한 search_input_value를 포함하는 채널 구성원
        search_members = Passer.objects.filter(channel=curChannel, passer_name__contains=search_input_value).exclude(passer_name=request.user.name)

        # 채널 구성원들 id를 모은 리스트
        result_member_list = []
        for member in search_members:
            result_member_list.append(member.id)


        # search_cho: 검색어의 초성 모두 추출
        # search_letter: 검색어 중 자모 결합인 경우
        search_cho, search_letter = get_chosung_from_input(search_input_value)


        # 나를 제외한 search_letter를 포함하는 채널 구성원
        search_letter_members = Passer.objects.filter(channel=curChannel, passer_name__contains=search_letter).exclude(passer_name=request.user.name)
        

        for member in search_letter_members:
            member_cho = get_chosung_from_str(member.passer_name)
            # 검색어의 초성에 해당하고 result_member_list에 존재하지 않으면 추가
            for ch in member_cho:
                if len(search_cho) != 0 and ch in search_cho and member.id not in result_member_list:
                    result_member_list.append(member.id)

        print(result_member_list)

        result_member_list = json.dumps(result_member_list)


        return JsonResponse({'result_list': result_member_list})



def start(request):
    return render(request, template_name="users/channel.html")

def channel_create(request):
    if request.method == 'POST':
        channel_name = request.POST['channel-create-name']
        channel_desc = request.POST['channel-create-desc']
        if channel_name == '':
            return render(request, 'error.html', {'errorMsg': '채널 이름을 정확하게 입력해 주세요.'})
        
        new_channel = Channel.objects.create(
            channel_name = channel_name,
            channel_desc = channel_desc
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
        # 신청자에게 운영진 권한 부여
        Staff.objects.create(
            user=request.user,
            channel = new_channel
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