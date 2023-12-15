from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import F, Func, Value, CharField
from asgiref.sync import sync_to_async
import json
import datetime

from .models import OpenChat, OpenPost

# Create your views here.
def demo_chat(request):
    return render(request, 'demo/openRoom.html', {'title': '피로그래밍 20기'})

# DB에 말풍선 저장
async def save_msg(data):

    # 새 말풍선 저장
    newBubble = await sync_to_async(OpenChat.objects.create)(
        name = data['name'],
        content = data['msg'],
        file = data['file'],
        r = data['r'],
        g = data['g'],
        b = data['b']
    )
    await sync_to_async(newBubble.save)()
    
    return newBubble

def load_bubbles(request):
    if request.method == 'POST':
        req = json.loads(request.body)
        page = req['page']

        # 말풍선 데이터 get
        bubbles = OpenChat.objects.values(
            'name', 'content', 'file', 'r', 'g', 'b', 'created_at', 'updated_at'
        ).annotate(
            hour=Func(
                F('created_at'),
                Value('%H'),
                function='DATE_FORMAT',
                output_field=CharField()
            ),
            min=Func(
                F('created_at'),
                Value('%i'),
                function='DATE_FORMAT',
                output_field=CharField()
            ),
            year=Func(
                F('created_at'),
                Value('%Y'),
                function='DATE_FORMAT',
                output_field=CharField()
            ),
            month=Func(
                F('created_at'),
                Value('%m'),
                function='DATE_FORMAT',
                output_field=CharField()
            ),
            day=Func(
                F('created_at'),
                Value('%d'),
                function='DATE_FORMAT',
                output_field=CharField()
            ),
        ).order_by('-created_at')[page:page+20]

        for bubble in bubbles:
            bubble['content'] = str(bubble['content'])
            bubble['file'] = bubble['file'].replace('/', '/media/', 1)

        bubbles = list(bubbles)
        if len(bubbles) == 0:
            return JsonResponse({'result': None})
        
        return JsonResponse({'result': json.dumps(bubbles, default=str)})
    
#DB에 게시글 저장
async def save_post(data):
    newPost = await sync_to_async(OpenPost.objects.create)(
        name = data['name'],
        content = data['postInput'],
    )
    await sync_to_async(newPost.save)()

    return newPost

async def save_happy(data):
    post = await sync_to_async(OpenPost.objects.get)(id=data['post_id'])
    post.like += 1
    await sync_to_async(post.save)()

    return post, post.like

async def save_sad(data):
    post = await sync_to_async(OpenPost.objects.get)(id=data['post_id'])
    post.sad += 1
    await sync_to_async(post.save)()

    return post, post.sad

async def delete_post(data):
    post = await sync_to_async(OpenPost.objects.get)(id=data['post_id'])
    print(post)
    await sync_to_async(post.delete)()

    return None

def load_posts(request):
    if request.method == 'POST':

        posts = OpenPost.objects.all().values(
            'id', 'name', 'content', 'like', 'sad', 'created_at'
        )

        print('post!!!!', posts)

        # datetime 객체를 처리 못하는 에러 핸들링
        def json_default(value):
            if isinstance(value, datetime.datetime):
                return value.strftime('%Y-%m-%d')

        posts = list(posts)
        return JsonResponse({'result': json.dumps(posts, default=json_default)})