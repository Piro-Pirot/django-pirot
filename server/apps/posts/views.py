from django.shortcuts import render
from .models import Post, Happy, Sad
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

# 새 게시글 버튼 누르면 작성 창 등장 -> url : /create
# 작성 버튼 누르면 게시글 CREATE
# request : room_id, text
# def post_create(request):
    # req = json.loads(request.body)
    # room_id = req['room_id']
    # text = req['text']
    # user_id = request.user.id # 현재 로그인한 유저의 id

    # if text:
    #     post = Post.objects.create(
    #         user_id = user_id,
    #         rood_id = room_id,
    #         content = text,
    #         created_at = timezone.now(),
    #     )
    #     post.save()

    #     return JsonResponse({'post':post})


# 삭제 버튼 누르면 게시글 DELETE
# '삭제되었습니다!' alert로 띄우고 자동 reload되면 게시글이 사라지는 걸로 구상
# request : post_id
# @csrf_exempt
# def delete_ajax(request):
#     req = json.loads(request.body)
#     post_id = req['post_id']
#     post =  Post.objects.get(id=post_id)
#     post.delete()

#     return JsonResponse()


# REVIEW : emotion_ajax로 통합하고 감정 파라미터를 전달받아 코드 반복 제거
# 기뻐요 버튼
@csrf_exempt
def happy_ajax(request):
    req = json.loads(request.body)
    user_id = request.user.id
    post_id =req['post_id']
    post = Post.objects.get(id=post_id)

    try:
        # happy가 이미 눌러져 있는 경우
        happy = Happy.objects.get(id=post_id)
    except Happy.DoesNotExist:
        # 아직 happy를 누르지 않은 경우
        happy = None

    try:
        # sad가 이미 눌러져 있는 경우
        sad = Sad.objects.get(id=post_id)
    except Sad.DoesNotExist:
        # 아직 sad를 누르지 않은 경우
        sad = None
    
    if sad:
        sad.delete()
        happy = Happy.objects.create(
                post_id = post,
                user_id = user_id,
            )
        happy.save()
    else:
        if happy:
            happy.delete()
        else:
            happy = Happy.objects.create(
                post_id = post,
                user_id = user_id,
            )
            happy.save()

    # 이 경우에는 버튼에 표시될 총 개수만 필요할 것 같아서 일단 이렇게 처리!
    happy_count = Happy.objects.filter(id=post_id).count()
    sad_count = Sad.objects.filter(id=post_id).count()

    return JsonResponse({"happy_count":happy_count, "sad_count":sad_count})


# 슬퍼요 버튼
@csrf_exempt
def sad_ajax(request):
    req = json.loads(request.body)
    user_id = request.user.id
    post_id =req['post_id']
    post = Post.objects.get(id=post_id)

    try:
        # happy가 이미 눌러져 있는 경우
        happy = Happy.objects.get(id=post_id)
    except Happy.DoesNotExist:
        # 아직 happy를 누르지 않은 경우
        happy = None

    try:
        # sad가 이미 눌러져 있는 경우
        sad = Sad.objects.get(id=post_id)
    except Sad.DoesNotExist:
        # 아직 sad를 누르지 않은 경우
        sad = None
    
    if happy:
        happy.delete()
        sad = Sad.objects.create(
                post_id = post,
                user_id = user_id,
            )
        sad.save()
    else:
        if sad:
            sad.delete()
        else:
            sad = Sad.objects.create(
                post_id = post,
                user_id = user_id,
            )
            sad.save()

    happy_count = Happy.objects.filter(id=post_id).count()
    sad_count = Sad.objects.filter(id=post_id).count()

    return JsonResponse({"happy_count":happy_count, "sad_count":sad_count})
