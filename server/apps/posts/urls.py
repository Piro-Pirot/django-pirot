from django.urls import path
from server.apps.posts.views import *

urlpatterns = [
    path('load_posts_ajax/', load_posts),
]