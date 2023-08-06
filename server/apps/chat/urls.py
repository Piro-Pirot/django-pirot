from django.urls import path
from .views import *

urlpatterns = [
    path('<slug:type>/', main_room),
    path('<uuid:pk>/<slug:type/', enter_room),
]