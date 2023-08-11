from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

class SignupForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'name', 'password1', 'password2']
        # fields = '__all__'

# def register(request):
#     if request.method == 'GET':
#         return render(request,'/users/signup/')
    
#     elif request.method == 'POST':
#         user_id = request.POST.get('id', '')
#         user_pw = request.POST.get('pw', '')
#         user_pw_confirm = request.POST.get('pw-confirm', '')
#         user_name = request.POST.get('name', '')
#         user_email = request.POST.get('email', '')
        
#         if (user_id or user_pw or user_pw_confirm or user_email) == '':
#             return redirect('users/signup/')
#         elif user_pw != user_pw_confirm:
#             return redirect('users/signup/')
#         else:
#             user = User(
#                 user_id=user_id,
#                 user_pw=user_pw,
#                 user_name=user_name,
#                 user_email=user_email
#             )
#             user.save()
#         return redirect('/')