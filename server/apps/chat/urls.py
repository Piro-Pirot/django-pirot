from django.urls import path
from .views import *

urlpatterns = [
    path('<str:channelName>/<str:type>/', main_room),
    path('<str:channelName>/<uuid:pk>/<str:type>/', enter_room),
]