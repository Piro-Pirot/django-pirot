from django.shortcuts import render

def index(request):
    return render(request, 'index.html', {})

def room(request):
    return render(request, 'base.html', {})
