from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Room)
admin.site.register(RoomMember)
admin.site.register(BlindRoomMember)
admin.site.register(Lock)