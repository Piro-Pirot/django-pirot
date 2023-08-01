from django.shortcuts import render
from .models import Post, Happy, Sad
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

# 편의를 위해 변수명을 s만 붙인 형태로 지었어요..
def board(request):
    posts = Post.objects.all()
    happys = Happy.objects.all()
    sads = Sad.objects.all()

    return render(request, "#",{"posts":posts, "happys":happys, "sads":sads})


# 새 게시글 버튼 누르면 작성 창 등장?
# 작성 버튼 누르면 게시글 생성
# 게시글 : content, room_id(FK), created_at, user_id(현재 로그인 user)
# request : room_id, text, request.user(현재 로그인 user의 id)
@csrf_exempt
def create_ajax(request):
    req = json.loads(request.body)
    room_id = req['room_id']
    text = req['text']
    user_id = req['user_id']

    if text:
        post = Post.objects.create(
            user_id = user_id,
            rood_id = room_id,
            content = text,
            created_at = timezone.now(),
        )
        post.save()
        happy = Happy.objects.create(
            post_id = post,
            user_id = user_id,
        )
        happy.save()
        sad = Sad.objects.create(
            post_id = post,
            user_id = user_id,
        )
        sad.save()

        return JsonResponse({'post':post, 'happy':happy, 'sad':sad})

# 삭제 버튼 누르면 게시글 삭제
# 일단 '삭제되었습니다!' alert로 띄우고 자동 reload되면 게시글이 사라지는 걸로 생각
@csrf_exempt
def delete_ajax(request):
    req = json.loads(request.body)
    post_id = req['post_id']
    post =  Post.objects.get(id=post_id)
    post.delete()

    return JsonResponse()

# @csrf_exempt
# def happy_ajax(request):
#     req = json.loads(request.body)
#     post_id =req['post_id']
#     post = Post.objects.get(id=post_id)