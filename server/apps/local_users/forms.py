from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User, SMS_Auth
import phonenumbers

class SignupForm(UserCreationForm):
    phone_number = forms.CharField(label='전화번호', max_length=20)
    def clean_phone_number(self):
        phone_number = self.cleaned_data['phone_number']
        
        # 입력된 번호 문자열을 파싱
        parsed_number = phonenumbers.parse(phone_number, "KR")
        
        # 번호의 유효성 검증
        if not phonenumbers.is_valid_number(parsed_number):
            raise forms.ValidationError('유효하지 않은 전화번호입니다.')

        return phone_number
    
    def save(self, commit=True):
        user = super().save(commit=False)
        phone_number = self.cleaned_data['phone_number']
        
        # User 모델의 phone_number 필드에 저장
        user.phone_number = phone_number
        user.save()
        
        # SMS_Auth 모델의 phone_number 필드에 저장
        SMS_Auth.objects.create(phone_num=phone_number, auth_num=None)
        
        return user
    
    class Meta:
        model = User
        fields = ['username', 'password1', 'password2', 'phone_number']
        # fields = '__all__'