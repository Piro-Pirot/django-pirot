from django.urls import path
from .views import *

urlpatterns = [
    path('create_room/<int:channelId>/<int:target>/', create_room),
    path('create_group_room/<int:channelId>/', create_group_room),
    path('<int:channelId>/<str:type>/', main_room),
    path('<int:channelId>/<int:roomId>/<str:type>/', enter_room),
]