from django.urls import path
from server.apps.channels import views

urlpatterns = [
    path("", views.index),
    path("room/", views.room),
    path("passer_create/level/", views.passer_create_level),
    # path("passer_create/?channel=%s", passer_create_level),
    # path("passer_create/?level=%s&channel=%s", passer_create),
    # path("code_create/", code_create),
    # path("channel/setting/?channel=%s", default_profile),
    # path("passer_delete/", join_delete),
    # path("/user/setting/", profile_setting),
]