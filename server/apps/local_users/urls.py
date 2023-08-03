from django.urls import path
from server.apps.local_users.views import *

urlpatterns = [
    path("user/setting/", profile_setting),
]