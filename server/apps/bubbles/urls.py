from django.urls import path

from .views import *


urlpatterns = [
    path('load_bubbles_ajax/', load_bubbles),
    path('upload_files/', upload_files),
]