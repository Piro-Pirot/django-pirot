from django.urls import path
from .views import *

urlpatterns = [
    path('create_room/<int:channelId>/<int:target>/', create_room),
    path('<int:channelId>/<str:type>/', main_room),
    path('<int:channelId>/<int:roomId>/<str:type>/', enter_room),
]