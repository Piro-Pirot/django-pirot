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

    # if (await sync_to_async(Happy.objects.filter(post__id=data['postId'], user = curUserObj).count)() > 1
    #     and await sync_to_async(Sad.objects.filter(post__id=data['postId'], user = curUserObj).count)() == 0):
        
    #     happyObj = await sync_to_async(Happy.objects.get)(post__id=data['postId'], user = curUserObj)
    #     await sync_to_async(happyObj.delete)()
    # elif (await sync_to_async(Happy.objects.filter(post__id=data['postId'], user = curUserObj).count)() == 0
    #     and await sync_to_async(Sad.objects.filter(post__id=data['postId'], user = curUserObj).count)() > 1):
        
    #     sadObj = await sync_to_async(Sad.objects.get)(post__id=data['postId'], user = curUserObj)
    #     await sync_to_async(sadObj.delete)()

    #     newHappy = await sync_to_async(Happy.objects.create)(
    #         post = curPostObj,
    #         user = curUserObj,
    #         )
    #     await sync_to_async(newHappy.save)()
    # else:
    #     newHappy = await sync_to_async(Happy.objects.create)(
    #         post = curPostObj,
    #         user = curUserObj,
    #         )
    #     await sync_to_async(newHappy.save)()

    newHappy = await sync_to_async(Happy.objects.create)(
        post = curPostObj,
        user = curUserObj,
        )
    await sync_to_async(newHappy.save)()

    HappyCount = await sync_to_async(Happy.objects.filter(post__id=data['postId']).count)()

    return newHappy, HappyCount


async def save_sad(data):
    curUserObj = await sync_to_async(User.objects.get)(username=data['user']) # admin, minseo같은
    curPostObj = await sync_to_async(Post.objects.get)(id=data['postId'])

    # if (await sync_to_async(Happy.objects.filter(post__id=data['postId'], user = data['user']).count)() > 1
    #     and await sync_to_async(Sad.objects.filter(post__id=data['postId'], user = data['user']).count)() == 0):
        
    #     happyObj = await sync_to_async(Happy.objects.get)(post__id=data['postId'], user = data['user'])
    #     await sync_to_async(happyObj.delete)()
    # elif (await sync_to_async(Happy.objects.filter(post__id=data['postId'], user = data['user']).count)() == 0
    #     and await sync_to_async(Sad.objects.filter(post__id=data['postId'], user = data['user']).count)() > 1):
        
    #     sadObj = await sync_to_async(Sad.objects.get)(post__id=data['postId'], user = data['user'])
    #     await sync_to_async(sadObj.delete)()

    #     newHappy = await sync_to_async(Happy.objects.create)(
    #         post = curPostObj,
    #         user = curUserObj,
    #         )
    #     await sync_to_async(newHappy.save)()
    # else:
    #     newHappy = await sync_to_async(Happy.objects.create)(
    #         post = curPostObj,
    #         user = curUserObj,
    #         )
    #     await sync_to_async(newHappy.save)()

    newSad = await sync_to_async(Sad.objects.create)(
        post = curPostObj,
        user = curUserObj,
        )
    await sync_to_async(newSad.save)()

    SadCount = await sync_to_async(Sad.objects.filter(post__id=data['postId']).count)()

    return newSad, SadCount


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


# # 기뻐요 버튼
# @csrf_exempt
# def happy_ajax(request):
#     req = json.loads(request.body)
#     user_id = request.user.id
#     post_id =req['post_id']
#     post = Post.objects.get(id=post_id)

#     try:
#         # happy가 이미 눌러져 있는 경우
#         happy = Happy.objects.get(id=post_id)
#     except Happy.DoesNotExist:
#         # 아직 happy를 누르지 않은 경우
#         happy = None

#     try:
#         # sad가 이미 눌러져 있는 경우
#         sad = Sad.objects.get(id=post_id)
#     except Sad.DoesNotExist:
#         # 아직 sad를 누르지 않은 경우
#         sad = None
    
#     if sad:
#         sad.delete()
#         happy = Happy.objects.create(
#                 post_id = post,
#                 user_id = user_id,
#             )
#         happy.save()
#     else:
#         if happy:
#             happy.delete()
#         else:
#             happy = Happy.objects.create(
#                 post_id = post,
#                 user_id = user_id,
#             )
#             happy.save()

#     # 이 경우에는 버튼에 표시될 총 개수만 필요할 것 같아서 일단 이렇게 처리!
#     happy_count = Happy.objects.filter(id=post_id).count()
#     sad_count = Sad.objects.filter(id=post_id).count()

#     return JsonResponse({"happy_count":happy_count, "sad_count":sad_count})


# # 슬퍼요 버튼
# @csrf_exempt
# def sad_ajax(request):
#     req = json.loads(request.body)
#     user_id = request.user.id
#     post_id =req['post_id']
#     post = Post.objects.get(id=post_id)

#     try:
#         # happy가 이미 눌러져 있는 경우
#         happy = Happy.objects.get(id=post_id)
#     except Happy.DoesNotExist:
#         # 아직 happy를 누르지 않은 경우
#         happy = None

#     try:
#         # sad가 이미 눌러져 있는 경우
#         sad = Sad.objects.get(id=post_id)
#     except Sad.DoesNotExist:
#         # 아직 sad를 누르지 않은 경우
#         sad = None
    
#     if happy:
#         happy.delete()
#         sad = Sad.objects.create(
#                 post_id = post,
#                 user_id = user_id,
#             )
#         sad.save()
#     else:
#         if sad:
#             sad.delete()
#         else:
#             sad = Sad.objects.create(
#                 post_id = post,
#                 user_id = user_id,
#             )
#             sad.save()

#     happy_count = Happy.objects.filter(id=post_id).count()
#     sad_count = Sad.objects.filter(id=post_id).count()

#     return JsonResponse({"happy_count":happy_count, "sad_count":sad_count})
