from django.urls import path
from .views import *

urlpatterns = [
    path('', main),
    path('login/', login),
    path('logout/', logout),
    path('signup/', signup),
    path('username_check_ajax/', username_check_ajax),
    path('setting/<int:channelID>/', profile_setting),
    path('signup/send_sms/', sms_sender, name='send_sms'),
    path('signup/authcheck/', sms_check, name='sms_check'),
    path('preferences/', preferences),

    path('update_phone_ajax/', update_phone_ajax),
    path('update_pw_ajax/', update_pw_ajax),
    path('lost_pw/', lost_pw),
    path('unregister/', unregister),
    path('byebye/', byebye),
]