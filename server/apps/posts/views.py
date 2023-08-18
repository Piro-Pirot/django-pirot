import json, datetime
from bs4 import BeautifulSoup
from django.http import JsonResponse
from django.shortcuts import redirect, render
from asgiref.sync import sync_to_async
from .models import Post, Happy, Sad, User, Room

#DB에 게시글 저장
async def save_post(room, data):
    curUserObj = await sync_to_async(User.objects.get)(username=data['user'])

    newPost = await sync_to_async(Post.objects.create)(
        content = data['postInput'],
        user = curUserObj,
        room = room,
    )
    await sync_to_async(newPost.save)()

    HappyCount = await sync_to_async(Happy.objects.filter(post__id=newPost.id).count)()
    SadCount = await sync_to_async(Sad.objects.filter(post__id=newPost.id).count)()

    return newPost, HappyCount, SadCount

# DB에 기뻐요 객체 저장
# 예외 처리 : 이미 이 포스트 id와 ''현재''user id 가진 happy 객체가 있으면 객체 삭제.
async def save_happy(data):
    curUserObj = await sync_to_async(User.objects.get)(username=data['user']) # admin, minseo같은
    curPostObj = await sync_to_async(Post.objects.get)(id=data['postId'])
    curHappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId'], user = curUserObj).count)()
    curSadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId'], user = curUserObj).count)()

    if (curHappyCount == 1 and curSadCount == 0):
        
        happyObj = await sync_to_async(Happy.objects.get)(post__id=data['postId'], user = curUserObj)
        await sync_to_async(happyObj.delete)()

        HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()
        SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()
        return HappyCount, SadCount, curHappyCount, curSadCount

    elif (curHappyCount == 0 and curSadCount == 1):
        
        sadObj = await sync_to_async(Sad.objects.get)(post__id=data['postId'], user = curUserObj)
        await sync_to_async(sadObj.delete)()

        newHappy = await sync_to_async(Happy.objects.create)(
            post = curPostObj,
            user = curUserObj,
            )
        await sync_to_async(newHappy.save)()

        HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()
        SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()
        curHappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId'], user = curUserObj).count)()

        return HappyCount, SadCount, curHappyCount, curSadCount
    
    else:
        newHappy = await sync_to_async(Happy.objects.create)(
            post = curPostObj,
            user = curUserObj,
            )
        await sync_to_async(newHappy.save)()

        HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()
        SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()
        curHappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId'], user = curUserObj).count)()

        return HappyCount, SadCount, curHappyCount, curSadCount


async def save_sad(data):
    curUserObj = await sync_to_async(User.objects.get)(username=data['user']) # admin, minseo같은
    curPostObj = await sync_to_async(Post.objects.get)(id=data['postId'])
    curHappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId'], user = curUserObj).count)()
    curSadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId'], user = curUserObj).count)()
    
    if (curSadCount == 1 and curHappyCount == 0):
        
        sadObj = await sync_to_async(Sad.objects.get)(post__id=data['postId'], user = curUserObj)
        await sync_to_async(sadObj.delete)()

        HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()
        SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()
        return HappyCount, SadCount, curHappyCount, curSadCount

    elif (curSadCount == 0 and curHappyCount == 1):
        
        happyObj = await sync_to_async(Happy.objects.get)(post__id=data['postId'], user = curUserObj)
        await sync_to_async(happyObj.delete)()

        newSad = await sync_to_async(Sad.objects.create)(
            post = curPostObj,
            user = curUserObj,
            )
        await sync_to_async(newSad.save)()

        HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()
        SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()
        curSadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId'], user = curUserObj).count)()

        return HappyCount, SadCount, curHappyCount, curSadCount
    
    else:
        newSad = await sync_to_async(Sad.objects.create)(
            post = curPostObj,
            user = curUserObj,
            )
        await sync_to_async(newSad.save)()

        HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()
        SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()
        curSadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId'], user = curUserObj).count)()

        return HappyCount, SadCount, curHappyCount, curSadCount
    

async def display_mine(data):

    postObj = await sync_to_async(Post.objects.get)(id=data['postId'])
    await sync_to_async(postObj.delete)()

    return None
    

# 게시글 Delete
async def delete_post(room, data):

    postObj = await sync_to_async(Post.objects.get)(id=data['postId'])
    await sync_to_async(postObj.delete)()

    return None


def load_posts(request):
    if request.method == 'POST' and request.user.is_authenticated:
        req = json.loads(request.body)
        room_id = req['roomId']
        curUsername = req['curUsername']

        curRoom = Room.objects.get(id=room_id)

        posts = Post.objects.filter(room=curRoom).values(
            'id', 'content', 'room', 'created_at', 'user__username'
        )
        for post in posts:
            happyCount = Happy.objects.filter(post__id=post['id']).count()
            sadCount = Sad.objects.filter(post__id=post['id']).count()
            curhappyCount = Happy.objects.filter(post__id=post['id'], user__username = curUsername).count()
            cursadCount = Sad.objects.filter(post__id=post['id'], user__username = curUsername).count()
            post['happyCount'] = happyCount
            post['sadCount'] = sadCount
            post['content'] = str(post['content'])
            post['curhappyCount'] = curhappyCount
            post['cursadCount'] = cursadCount

        # datetime 객체를 처리 못하는 에러 핸들링
        def json_default(value):
            if isinstance(value, datetime.datetime):
                return value.strftime('%Y-%m-%d')

        posts = list(posts)
        return JsonResponse({'result': json.dumps(posts, default=json_default)}) 