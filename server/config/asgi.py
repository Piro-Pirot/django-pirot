"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import site
import django
import socketio

site.addsitedir(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from django.core.asgi import get_asgi_application
django.setup()

from server.apps.chat.socketio import sio

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_asgi_application()

# wrap with socketio's middleware
application = socketio.ASGIApp(sio, application)
