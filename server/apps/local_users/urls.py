from django.urls import path
from .views import *

urlpatterns = [
    path('', main),
    path('login/', login),
    path('logout/', logout),
    path('signup/', signup),
    path('setting/', profile_setting),
]