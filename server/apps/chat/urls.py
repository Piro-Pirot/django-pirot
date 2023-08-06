from django.urls import path
from .views import *

urlpatterns = [
    path('main/', main_room),
    path('<uuid:pk>/', enter_room),
]