from django.urls import path

from .views import *

urlpatterns = [
    path('load_bubbles_ajax/', load_bubbles),
    path('load_posts_ajax/', load_posts),
]