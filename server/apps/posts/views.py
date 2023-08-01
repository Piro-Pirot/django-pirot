from django.shortcuts import render
from .models import Post
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone

def board(request):
    posts = Post.objects.all()
    #happy
    #sad

    return render(request, "#",{"posts":posts})


# 새 게시글 버튼 누르면 작성 창 등장

# 작성 누르면 비동기로 게시글 생성
# 게시글 : content, room_id(FK), created_at, user_id(현재 로그인 user)
@csrf_exempt
def create_ajax(request):
    req = json.loads(request.body)
    user_id = req['user_id']
    room_id = req['room_id']
    text = req['text']

    if text:
        post = Post.objects.create(
            user_id = user_id,
            rood_id = room_id,
            content = text,
            created_at = timezone.now(),
        )
        post.save()

        return JsonResponse({'post':post, 'text':text})

def post_delete(request):
    pass