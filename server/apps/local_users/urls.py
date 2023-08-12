from django.urls import path
from .views import *

urlpatterns = [
    path('', main),
    path('login/', login),
    path('logout/', logout),
    path('signup/', signup),
    path('setting/<int:channelID>/', profile_setting),
    path('channel/', start),
    path('channel/create/', channel_create),
    path('channel/code/', channel_code),
    path('signup/send_sms/', SMS_send.as_view(), name='send_sms'),
    path('signup/authcheck/', sms_check, name='sms_check'),
]