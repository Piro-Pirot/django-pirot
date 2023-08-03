from django.shortcuts import render, redirect
from server.apps.channels.models import Staff


# 일반회원 : 프로필 설정 페이지 / 운영진 : 운영진 페이지
def profile_setting(request):

    current_user = request.user

    # 운영진 여부
    if Staff.objects.filter(user=current_user).exists():
        return redirect("/staff/passer_create/level/")

    if request.method == "POST":
        current_user.profile_img = request.POST["profile_img"]
        current_user.save()

        return redirect("/user/setting/") # 프로필 설정 페이지에 머무름
    
    return render(request, "#", {"user":current_user})