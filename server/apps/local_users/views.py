from django.shortcuts import render, redirect
from .forms import SignupForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth
from server.apps.channels.models import Staff, Channel


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