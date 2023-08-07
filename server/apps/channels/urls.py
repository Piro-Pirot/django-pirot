from django.urls import path
from server.apps.channels import views

urlpatterns = [
    path("", views.index),
    path("setting/<int:channelID>/", views.profile_staff),
    path("passer_create/level/<int:channelID>/", views.passer_create_level),
    path("passer_create/passer/<int:channelID>/", views.passer_create),
    path("code_create/<int:channelID>/", views.code_create),
    path("channel/setting/<int:channelID>/", views.default_profile),
    path("staff_authority/<int:channelID>/", views.staff_authority),
    path("join_delete/<int:channelID>/", views.join_delete),
]