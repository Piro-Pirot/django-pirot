import json, datetime
from django.shortcuts import redirect, render
from .models import *
from server.apps.bubbles.models import *
from server.apps.channels.models import *
from server.apps.posts.models import *

# Create your views here.

def create_room(request, channelId, target):
    if request.method == 'POST':
        me = request.user
        # 개인 채팅 상대방 알아오기
        you = User.objects.get(id=target)
        
        myRooms = RoomMember.objects.filter(user=me)
        yourRooms = RoomMember.objects.filter(user=you)

        directRoom = ''
        
        # 채팅 방 있는지 확인
        for mine in myRooms:
            for yours in yourRooms:
                if mine.room == yours.room:
                    directRoom = mine.room
                    break
            if directRoom != '':
                break

        if not directRoom:
            # 채팅 방 개설
            Room.objects.create(
                room_name = '__direct',
                channel = Channel.objects.get(id=channelId)
            ).save()
            newDirectRoom = Room.objects.all().last()
            # 채팅 방 참여자 추가
            RoomMember.objects.create(
                user = me,
                room = newDirectRoom
            ).save()
            RoomMember.objects.create(
                user = you,
                room = newDirectRoom
            ).save()
            directRoom = newDirectRoom

        return redirect(f'/room/{channelId}/{directRoom.id}/main/')
    
    return redirect('/')


def main_room(request, channelId, type):
    # 로그인 되어 있을 때만 접근
    if not request.user.is_authenticated:
        return redirect('/')
    
    myBlindRooms = ''
    myRooms = ''

    myFriends = ''
    myPassInfo = ''

    myChannels = []

    curChannel = Channel.objects.get(id=channelId)
    
    if type == 'main' or type == 'friends':
        # 현재 로그인 사용자가 참여하고 있는 채팅 방
        myBlindRooms = BlindRoomMember.objects.filter(user=request.user, room__channel=curChannel)
        myRooms = RoomMember.objects.filter(user=request.user, room__channel=curChannel)

        # 현재 로그인 사용자
        myPassInfo = Passer.objects.filter(passer_name=request.user.name, channel=curChannel)[0]
        # 현재 로그인 사용자의 채널 구성원들
        myFriends = Passer.objects.filter(channel__id=channelId).exclude(pk=myPassInfo.pk)

        # 현재 로그인 사용자의 소속 채널
        myJoinInfo = Join.objects.filter(user=request.user)
        for joinInfo in myJoinInfo:
            myChannels.append(Channel.objects.get(id=joinInfo.passer.channel.id))
    else:
        return redirect('/')

    return render(
        request,
        'rooms/roomHome.html',
        {
            'title': 'Hello world!',
            'channel': curChannel,
            'jsonBubbles': '',
            'myRooms': myRooms,
            'myBlindRooms': myBlindRooms,
            'myFriends': myFriends,
            'myPassInfo': myPassInfo,
            'urlType': type,
            'myChannels': myChannels,
            'jsonPosts' : '',
        }
    )


# 채팅 방에 입장
def enter_room(request, channelId, roomId, type):
    if not request.user.is_authenticated:
        return redirect('/')
    
    myBlindRooms = ''
    myRooms = ''

    myFriends = ''
    myPassInfo = ''

    myChannels = []

    # URL을 통해 채널, 채팅 방 정보 가져옴
    curRoom = Room.objects.get(id=roomId)
    title = curRoom.room_name
    curChannel = Channel.objects.get(id=channelId)

    if type == 'main' or type == 'friends':
        # 현재 로그인 사용자가 참여하고 있는 채팅 방
        myBlindRooms = BlindRoomMember.objects.filter(user=request.user, room__channel=curChannel)
        # 현재 로그인 사용자가 참여하고 있는 채팅 방
        myRooms = RoomMember.objects.filter(user=request.user, room__channel=curChannel)
    
        # 현재 로그인 사용자
        myPassInfo = Passer.objects.filter(passer_name=request.user.name, channel=curChannel)[0]
        # 현재 로그인 사용자의 채널 구성원들
        myFriends = Passer.objects.filter(channel=curChannel).exclude(id=myPassInfo.id)

        # 현재 로그인 사용자의 소속 채널
        myJoinInfo = Join.objects.filter(user=request.user)
        for joinInfo in myJoinInfo:
            myChannels.append(Channel.objects.get(id=joinInfo.passer.channel.id))
        print(myChannels)
    else:
        return redirect('/')

    
    if curRoom.room_type == 1:
        #익명채팅방
        roomMembers = curRoom.blindroommember_set.all()
        # 말풍선 데이터 get
        bubbles = BlindBubble.objects.filter(room=curRoom).values(
            'room', 'content', 'is_delete',
            'read_cnt', 'file', 'nickname',
            'profile_img', 'created_at',
            'user__username'
        )
        # 게시글 데이터 get
        posts = Post.objects.filter(room=curRoom).values(
            'id', 'content', 'room', 'created_at', 'user__username'
        )
        # happys = Happy.objects.filter(post__room=curRoom).values(
        #     'post__id'
        # )
        # sads = Sad.objects.filter(post__room=curRoom).values(
        #     'post__id'
        # ) 어차피 happy나 sad나 post__id가 같긴 한데..
        # 각 게시물의 슬퍼요 개수를 여기서 계산해서 JS로 넘겨야 HTML에 삽입할 수 있는데 어케 넘겨?
    else:
        roomMembers = RoomMember.objects.filter(room=curRoom)
        # 말풍선 데이터 get
        bubbles = Bubble.objects.filter(room=curRoom).values(
            'room', 'content', 'is_delete',
            'read_cnt', 'file', 'created_at',
            'user__username'
        )
        posts = Post.objects.filter(room=curRoom).values(
            'id', 'content', 'room', 'created_at', 'user__username'
        )

    if curRoom.room_name == '__direct':
        directRoomMember = curRoom.roommember_set.all()
        for member in directRoomMember:
            if member.user != request.user:
                otherUser = member.user
                break
        title = otherUser.join.filter(passer__channel=curChannel)[0].passer


    bubbles = list(bubbles)
    # myRooms = list(myRooms)

    jsonBubbles = json.dumps(bubbles, default=str)
    # jsonRooms = json.dumps(myRooms, default=str)

    # js에서 말풍선을 만들기 위해 쿼리셋을 json으로 변환
    # jsonBubbles = serializers.serialize('json', bubbles)
    # print(jsonBubbles)


    def json_default(value):
        if isinstance(value, datetime.datetime):
            return value.strftime('%Y-%m-%d')

    posts = list(posts)
    jsonPosts = json.dumps(posts, default=json_default)

    # 여러 개의 구분된 값은 어떻게 보내징 근데 굳이 필요하나
    # happys = list(happys)
    # jsonHappys = json.dumps(happys, default=str)
    # sads = list(sads)
    # jsonSads = json.dumps(sads, default=str)


    # 현재 로그인 사용자가 채팅 방 멤버라면
    for member in roomMembers:
        if member.user == request.user:
            return render(
                request,
                'rooms/room.html',
                {
                    'title': title,
                    'room': curRoom,
                    'channel': curChannel,
                    'jsonBubbles': jsonBubbles,
                    'myRooms': myRooms,
                    'myBlindRooms': myBlindRooms,
                    'myFriends': myFriends,
                    'myPassInfo': myPassInfo,
                    'urlType': type,
                    'myChannels': myChannels,
                    'jsonPosts' : jsonPosts,
                }
            )
        
    # 채팅 방의 멤버가 아니라면 튕기기
    errorMsg = '잘못된 접근입니다.'
    return render(request, 'error.html', {'errorMsg': errorMsg})
