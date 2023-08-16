from django.urls import path
from .views import *

urlpatterns = [
    path('create_room/<int:channelId>/<int:target>/', create_room),
    path('create_group_room/<int:channelId>/', create_group_room),
    path('exit_room/', exit_room),
    path('invite_member_ajax/', invite_member_ajax),
    path('<int:channelId>/<str:type>/', main_room),
    path('<int:channelId>/<int:roomId>/<str:type>/', enter_room),
    path('setting_blindroom/', setting_blindroom_profile),
    # path('create_reddots_ajax/', load_reddots),
]