from django.contrib.auth.forms import UserCreationForm
from .models import User

class SignupForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'phone_number', 'profile_img', 'id', 'is_staff']