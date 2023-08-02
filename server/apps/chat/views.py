from django.shortcuts import render
import server.apps.bubbles.mongodb as mongodb

# Create your views here.

def test(request):
    mongodb.test()
    print('success')
    return render(request, 'base.html')