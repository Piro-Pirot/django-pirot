from django.urls import path
from server.apps.posts.views import *

urlpatterns = [
    path("/room/<char:pk>", board, name="room_%s"),
]