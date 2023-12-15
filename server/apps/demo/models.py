from django.db import models

# Create your models here.

class OpenChat(models.Model):
    name = models.CharField(max_length=255)
    content = models.TextField(null=True, blank=True)
    file = models.FileField(null=True, blank=True)
    r = models.IntegerField()
    g = models.IntegerField()
    b = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OpenPost(models.Model):
    name = models.CharField(max_length=255)
    content = models.TextField(null=True, blank=True)
    like = models.IntegerField(default=0)
    sad = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)