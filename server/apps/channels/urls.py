from django.urls import path
from server.apps.channels import views

urlpatterns = [
    path("", views.index),
    path("room/", views.room),
]