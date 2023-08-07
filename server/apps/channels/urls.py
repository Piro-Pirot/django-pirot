from django.urls import path
from server.apps.channels import views

urlpatterns = [
    path("", views.index),
    path("setting/", views.profile_staff),
    path("passer_create/level/", views.passer_create_level),
    path("passer_create/", views.passer_create),
    path("code_create/", views.code_create),
    path("channel/setting/", views.default_profile),
    path("staff_authority/", views.staff_authority),
    path("join_delete/", views.join_delete),
]