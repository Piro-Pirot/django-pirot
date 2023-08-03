from django.shortcuts import render, redirect
# from django.contrib.auth.models import User
from .models import User
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from .forms import SignupForm
from django.contrib import auth
from server.config import settings

def signup(request):
    # 폼을 제출하면 POST 요청을 처리하여 회원가입을 진행합니다.
    # 사용자가 회원가입 폼을 작성하고 제출한 경우
    if request.method =="POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            auth.login(request, user)
            return redirect('')
        # form의 데이터가 유효하지 않은 경우 
        return redirect('signup.html')
    # request.method =='GET'인 경우. 사용자가 회원가입 폼을 작성하고 제출하지 않은 경우
    else:
        form = SignupForm()
        return render(request,'signup.html', {'form' : form})
    
    # if request.method == "POST":
    #     if request.POST['password1'] == request.POST['password2']:
    #         user = User.objects.create_user(
    #             username=request.POST['username'], password=request.POST['password1'])
    #         auth.login(request,user)
    #         # 채널 처음 회원가입 후, 로그인했을때 채널의 메인 화면 띄우기
    #         return redirect('')
    # return render(request, 'signup.html')

# def login(request):
#     if request.method == "POST":
#         username = request.POST['username']
#         password = request.POST['password']
#         user = auth.authenticate(request, username = username, password=password)
#         if user is not None:
#             auth.login(request, user)
#             # 채널 처음 회원가입 후, 로그인했을때 채널의 메인 화면 띄우기
#             return redirect('')
#         else:
#             return render(request, 'login.html', {'error':'username or password is incorrect'})
#     else:
#         return render(request, 'login.html')

# def logout(request):
#     if request.method =="POST":
#         auth.logout(request)
#         # 로그아웃하면 보일 화면
#         return redirect('')
    
    
    
# def pgram_signup(request):

#     if request.method=='POST':
#         form = SignupForm(request.POST)
#         if form.is_valid():
#             user = form.save()
#             auth.login(request, user)
#             return redirect('/')
#         else:
#             ctx={
#                 'form':form,
#             }
#             return render(request, 'pgram/pgram_signup.html',context=ctx)
#     else:
#         form = SignupForm()
#         ctx={
#             'form':form,
#         }
#         return render(request, 'pgram/pgram_signup.html',context=ctx)

# def pgram_login(request):
#     if request.method=='POST':
#         form = AuthenticationForm(request, request.POST)
#         if form.is_valid():
#             user = form.get_user()
#             auth.login(request, user)
#             return redirect('/')
#         else:
#             ctx={
#                 'form':form,
#             }
#             return render(request, template_name='pgram/pgram_login.html', context=ctx)
#     else:
#         form = AuthenticationForm()
#         ctx={
#             'form':form,
#         }
#         return render(request, template_name='pgram/pgram_login.html', context=ctx)

# def pgram_logout(request):
#     auth.logout(request)
#     return redirect('/')