from django.shortcuts import render, redirect
from .forms import SignupForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib import auth

def main(request):
    return render(request, "index.html")


def signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            auth.login(request, user)
            return redirect('/')
        else:
            return redirect('/user/signup/')
    else:
        form = SignupForm()
        context = {
            'form': form,
        }
        return render(request, template_name='users/signup.html', context=context)


def login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)
        if form.is_valid():
            user = form.get_user()
            auth.login(request, user)
            return redirect('/')
        else:
            context = {
                'form': form,
            }
            return render(request, template_name='users/login.html', context=context)
    else:
        form = AuthenticationForm()
        context = {
            'form': form,
        }
        return render(request, template_name='base.html', context=context)


def logout(request):
    auth.logout(request)
    return redirect('/')