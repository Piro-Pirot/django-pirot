from django.urls import path
from .views import *

urlpatterns = [
    path('', test),
    path('<uuid:pk>/', enter_room),
]