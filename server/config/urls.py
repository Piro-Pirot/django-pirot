"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import include, path
import server.apps.channels.views
from django.urls import re_path as url
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', server.apps.channels.views.index),
    path('bubbles/', include('server.apps.bubbles.urls')),
    path('room/', include('server.apps.chat.urls')),
    path('posts/', include('server.apps.posts.urls')),
    path('user/', include('server.apps.local_users.urls')),
    path('staff/', include('server.apps.channels.urls')),

    url(r'^media/(?P<path>.*)$', serve, {'document_root':settings.MEDIA_ROOT}),
    url(r'^static/(?P<path>.*)$', serve, {'document_root':settings.STATIC_ROOT}),
]
