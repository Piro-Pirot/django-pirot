from django.shortcuts import render
from asgiref.sync import sync_to_async

from .models import Post, Happy, Sad, User

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

    if (await sync_to_async(Happy.objects.filter(post__id=data['postId'], user = curUserObj).count)() == 1
        and await sync_to_async(Sad.objects.filter(post__id=data['postId'], user = curUserObj).count)() == 0):
        
        happyObj = await sync_to_async(Happy.objects.get)(post__id=data['postId'], user = curUserObj)
        await sync_to_async(happyObj.delete)()

        HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()
        SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()
        return HappyCount, SadCount

    elif (await sync_to_async(Happy.objects.filter(post__id=data['postId'], user = curUserObj).count)() == 0
        and await sync_to_async(Sad.objects.filter(post__id=data['postId'], user = curUserObj).count)() == 1):
        
        sadObj = await sync_to_async(Sad.objects.get)(post__id=data['postId'], user = curUserObj)
        await sync_to_async(sadObj.delete)()

        newHappy = await sync_to_async(Happy.objects.create)(
            post = curPostObj,
            user = curUserObj,
            )
        await sync_to_async(newHappy.save)()

        HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()
        SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()

        return newHappy, HappyCount, SadCount
    
    else:
        newHappy = await sync_to_async(Happy.objects.create)(
            post = curPostObj,
            user = curUserObj,
            )
        await sync_to_async(newHappy.save)()

        HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()
        SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()

        return newHappy, HappyCount, SadCount

    # newHappy = await sync_to_async(Happy.objects.create)(
    #     post = curPostObj,
    #     user = curUserObj,
    #     )
    # await sync_to_async(newHappy.save)()


async def save_sad(data):
    curUserObj = await sync_to_async(User.objects.get)(username=data['user']) # admin, minseo같은
    curPostObj = await sync_to_async(Post.objects.get)(id=data['postId'])

    if (await sync_to_async(Sad.objects.filter(post__id=data['postId'], user = curUserObj).count)() == 1
        and await sync_to_async(Happy.objects.filter(post__id=data['postId'], user = curUserObj).count)() == 0):
        
        sadObj = await sync_to_async(Sad.objects.get)(post__id=data['postId'], user = curUserObj)
        await sync_to_async(sadObj.delete)()

        HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()
        SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()
        return HappyCount, SadCount

    elif (await sync_to_async(Sad.objects.filter(post__id=data['postId'], user = curUserObj).count)() == 0
        and await sync_to_async(Happy.objects.filter(post__id=data['postId'], user = curUserObj).count)() == 1):
        
        happyObj = await sync_to_async(Happy.objects.get)(post__id=data['postId'], user = curUserObj)
        await sync_to_async(happyObj.delete)()

        newSad = await sync_to_async(Sad.objects.create)(
            post = curPostObj,
            user = curUserObj,
            )
        await sync_to_async(newSad.save)()

        HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()
        SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()

        return newSad, HappyCount, SadCount
    
    else:
        newSad = await sync_to_async(Sad.objects.create)(
            post = curPostObj,
            user = curUserObj,
            )
        await sync_to_async(newSad.save)()

        HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()
        SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()

        return newSad, HappyCount, SadCount