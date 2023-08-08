"""
WSGI config for config project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os
import site
import django
import socketio

site.addsitedir(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.wsgi import get_wsgi_application

from server.apps.chat.socketio import sio

application = get_wsgi_application()

# wrap with socketio's middleware
application = socketio.WSGIApp(sio, application)
