from django.urls import path
from server.apps.posts.views import *

urlpatterns = [
    path("room/UUID", board, name="room_%s"),
]