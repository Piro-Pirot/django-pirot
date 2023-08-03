from django.urls import path
from server.apps.channels.views import *

urlpatterns = [
    path("/staff/passer_create/?channel=%s", passer_create_level),
    path("/staff/passer_create/?level=%s&channel=%s", passer_create),
    path("/staff/code_create/", code_create),
    path("/staff/channel/setting/?channel=%s", default_profile),
    path("/staff/passer_delete/", join_delete),
    path("/user/setting/", profile_setting),
]