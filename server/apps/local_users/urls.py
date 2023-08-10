from django.urls import path
from .views import *

urlpatterns = [
    path('', main),
    path('login/', login),
    path('logout/', logout),
    path('signup/', signup),
    path('setting/', profile_setting),
    path('signup/send_sms/', SMS_send.send_sms),
    path('signup/authcheck/', SMS_check.post),
]