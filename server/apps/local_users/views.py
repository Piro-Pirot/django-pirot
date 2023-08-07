from django.shortcuts import render, redirect
from .forms import SignupForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth
from server.apps.channels.models import Staff, Channel, Passer


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

# 일반회원 : 프로필 설정 페이지 / 운영진 : 운영진 페이지
def profile_setting(request, channelID):

    # 임시
    channelID = 1
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
    
    return render(request, 'users/profilesetting.html', context=context)