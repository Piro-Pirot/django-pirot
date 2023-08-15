// 서버와 Socket 연결 설정
const socket = io();

// 연결 성공 시 이벤트 리스너
socket.on('connect', async () => {
    console.log('connect to server');
    await socket.emit('join', {
        'room': curRoomId,
        'userId': curUserId
    });
});

let bScroll = 0;

socket.on('display_message', async (data) => {
    data = JSON.parse(data);
    console.log(data);
    let offsetH = 0;
    if(data['hour'] == lastHour && data['min'] == lastMin && data['user__name'] == lastSender && lastBubbleType == CHAT) {
        // 마지막 말풍선과 시간이 같고 보낸 사람이 같고 마지막 말풍선이 CHAT일 때 시간과 프로필을 표시하지 않음
        offsetH = displayMessage(data, false);
    } else {
        offsetH = displayMessage(data, true);
        lastHour = data['hour'];
        lastMin = data['min'];
        lastSender = data['user__name'];
        lastBubbleType = data['is_notice'];
    }
    console.log('offsetH is ...', offsetH);
    // console.log('conv height is...', conversationSection.scrollHeight);
    // console.log('conv top is...', conversationSection.scrollTop);
    // console.log('conv now is...', curScroll);
    // console.log('calcScroll is...', calcScroll());
    // console.log('bScroll is...', bScroll);
    // 스크롤을 너무 많이 올린 게 아니라면 맨 아래로
    if(bScroll - 700 <= offsetH) {
        console.log('controlling!');
        controlScroll();
    }
});

function onClickSendMessage(user, id) {
    // 서버로 메시지 전송
    const msgBox = document.querySelector(".input");
    let msg = msgBox.value;
    console.log(msg);
    // 아무것도 안 썼을 때 예외 처리
    // 개행문자 모두 제거
    if(msg.replace(/\n|\r|\s*/g, '') === '') return;
    msg = msg.replace(/\n/, '<br>');
    console.log(msg);

    msgBox.focus();

    controlScroll();

    socket.emit('send_message', {'msg': msg, 'file': 'delete me js', 'user': user, 'roomId': id});
    console.log('send successfully');

    document.querySelector('.input').value = null;
}

// 말풍선 표시
function displayMessage(bubbleData, newTimeFlag) {
    console.log(bubbleData);
    // 내가 방금 보낸 말풍선 표시

    let bubbleDiv = document.createElement('div');
    let bubbleContainer = document.createElement('div');

    NOTICE = 1
    if(bubbleData['is_notice'] === NOTICE) {
        bubbleDiv.classList.add('bubble-notice');
        bubbleContainer.classList.add('bubble-notice-container');
        bubbleContainer.innerHTML = bubbleData['content'];
        bubbleDiv.appendChild(bubbleContainer);
    } else {
        // 1분이 지나지 않았다면 직전 말풍선의 시간을 제거
        if(!newTimeFlag) {
            try {
                let lastTimeTag = document.querySelector('.conversation');
                lastTimeTag.lastElementChild.querySelector('.bubble-time').remove();
            } catch {
                console.log('first message');
            }
        } else {
            bubbleDiv.style.marginTop = '1rem';
        }

        if(bubbleData['user'] === curUsername) {
            // 로그인 사용자의 말풍선인 경우
            bubbleDiv.classList.add('bubble-box-me');
            bubbleContainer.classList.add('bubble-container-me');
        } else {
            bubbleDiv.classList.add('bubble-box');
            bubbleContainer.classList.add('bubble-container');
        }

        // 사진, 이름
        let bubbleHeader = document.createElement('div');
        bubbleHeader.classList.add('bubble-header');

        let profileImgContainer = document.createElement('div');
        profileImgContainer.classList.add('bubble-profile-img');

        let profileImg = document.createElement('img');
        profileImg.setAttribute('src', bubbleData['file']);

        let nameLabel = document.createElement('label');
        const BLIND_ROOM = 1;
        if(curRoomType == BLIND_ROOM) {
            // 익명 질문 방이면
            nameLabel.innerText = bubbleData['nickname'];
        } else {
            nameLabel.innerText = bubbleData['user__name'];
        }
        nameLabel.classList.add('bubble-username');

        // 1분이 지났고 내 채팅이 아닐 때 사진 이름 표시
        if(newTimeFlag && bubbleData['user'] !== curUsername) {
            profileImgContainer.appendChild(profileImg);
            bubbleHeader.appendChild(profileImgContainer);
            bubbleHeader.appendChild(nameLabel);
            bubbleContainer.appendChild(bubbleHeader);
        }

        // 내용과 시간을 담는 div
        let bubbleContentContainer = document.createElement('div');
        bubbleContentContainer.classList.add('bubble-content-container');

        // 내용
        let bubbleContent = document.createElement('div');
        bubbleContent.classList.add('bubble-content');
        bubbleContent.innerHTML = bubbleData['content'];

        let bubbleTime = document.createElement('label');
        bubbleTime.classList.add('bubble-time');
        bubbleTime.innerText = `${bubbleData['hour']}:${bubbleData['min']}`;

        if(bubbleData['user'] === curUsername) {
            //나의 말풍선일 때
            bubbleContentContainer.appendChild(bubbleTime);
            bubbleContentContainer.appendChild(bubbleContent);
        } else {
            bubbleContentContainer.appendChild(bubbleContent);
            bubbleContentContainer.appendChild(bubbleTime);
        }

        bubbleContainer.appendChild(bubbleContentContainer);

        bubbleDiv.appendChild(bubbleContainer);
    }

    curScroll = conversationSection.scrollTop;

    // 화면에 추가
    conversations.appendChild(bubbleDiv);

    return bubbleDiv.offsetHeight;
}


// -------------------- 게시판 -----------------------


// post 게시 이벤트 : 이벤트 명을 받고 콜백 함수를 실행
socket.on('display_post', async (data) => {
    console.log(data);
    displayPost(data);
});

// 서버로 게시글 전송 id = room.id
function onClickSendPost(user, id) {
    const postInput = document.querySelector('.post').value;

    // 아무것도 안 썼을 때 예외 처리
    if(postInput === '') return;
    console.log(postInput);

    socket.emit('send_post', {'postInput': postInput, 'user': user, 'roomId': id});
    console.log('send successfully');
}

// 게시글 표시
function displayPost(postData) {
    console.log(postData);
    // data로 받아옴!! data['newpostId'], ~ new post의 id, created_at 필요

    let postContainer = document.createElement('div');
    let postDiv = document.createElement('div');
    let postBox = document.createElement('div'); //석류가 추가한 코드
    let buttonDiv = document.createElement('div')
    
    // 로그인 사용자가 작성한 게시글인 경우
    if(postData['user'] == curUsername) {
        let happyBtn = document.createElement('button');
        happyBtn.classList.add('happy');
        let happyImg = document.createElement('i');
        happyImg.classList.add('ri-emotion-happy-line');
        let happyCount = document.createElement('span');
        happyCount.innerText = postData['happyCount'];
        happyCount.classList.add(`happy-count-${postData['newpostId']}`);
        happyBtn.appendChild(happyImg);
        happyBtn.appendChild(happyCount);
        happyBtn.onclick = function() {
            onClickHappy(postData['newpostId'], postData['roomId']);
        };
        buttonDiv.appendChild(happyBtn); // 기뻐요

        let sadBtn = document.createElement('button');
        sadBtn.classList.add('sad');
        let sadImg = document.createElement('i');
        sadImg.classList.add('ri-emotion-sad-line');
        let sadCount = document.createElement('span');
        sadCount.innerText = postData['sadCount'];
        sadCount.classList.add(`sad-count-${postData['newpostId']}`);
        sadBtn.appendChild(sadImg);
        sadBtn.appendChild(sadCount);
        sadBtn.onclick = function() {
            onClickSad(postData['newpostId'], postData['roomId']); //여기 좋아요를 누르는 유저가 들어가야함
        };
        buttonDiv.appendChild(sadBtn); // 슬퍼요

        let deleteBtn = document.createElement('button');
        let deleteIcon = document.createElement('i');
        deleteBtn.classList.add('delete');
        deleteIcon.classList.add('ri-close-line');
        deleteBtn.appendChild(deleteIcon);
        deleteBtn.onclick = function() {
            onClickDelete(postData['newpostId'], postData['roomId']);
        };
        buttonDiv.appendChild(deleteBtn); // 삭제 버튼

        postDiv.classList.add('post-box');
    } else {
        let happyBtn = document.createElement('button');
        happyBtn.classList.add('happy');
        let happyImg = document.createElement('i');
        happyImg.classList.add('ri-emotion-happy-line');
        let happyCount = document.createElement('span');
        happyCount.innerText = postData['happyCount'];
        happyCount.classList.add(`happy-count-${postData['newpostId']}`);
        happyBtn.appendChild(happyImg);
        happyBtn.appendChild(happyCount);
        happyBtn.onclick = function() {
            onClickHappy(postData['newpostId'], postData['roomId']);
        };
        buttonDiv.appendChild(happyBtn); // 기뻐요

        let sadBtn = document.createElement('button');
        sadBtn.classList.add('sad');
        let sadImg = document.createElement('i');
        sadImg.classList.add('ri-emotion-sad-line');
        let sadCount = document.createElement('span');
        sadCount.innerText = postData['sadCount'];
        sadCount.classList.add(`sad-count-${postData['newpostId']}`);
        sadBtn.appendChild(sadImg);
        sadBtn.appendChild(sadCount);
        sadBtn.onclick = function() {
            onClickSad(postData['newpostId'], postData['roomId']);
        };
        buttonDiv.appendChild(sadBtn); // 슬퍼요
    }

    // 작성일
    let postTime = document.createElement('div');
    postTime.classList.add('post-time');
    postTime.innerText = postData['created_at']

    // 내용
    let postContent = document.createElement('div');
    postContent.classList.add('post-content');
    postContent.innerText = postData['postInput'];
    postDiv.appendChild(postContent);
    postBox.appendChild(postDiv); // 석류가 추가한 코드
    postBox.appendChild(buttonDiv);

    postContainer.appendChild(postTime);
    postContainer.appendChild(postBox);

    postContainer.classList.add('post-container');
    postContainer.classList.add(`post-container-${postData['newpostId']}`);
    // 화면에 추가
    posts.appendChild(postContainer);

    document.querySelector('.post').value = '';

    controlScrollboard()
}


socket.on('display_happy', async (data) => {
    console.log(data);
    displayHappy(data);
});

socket.on('display_sad', async (data) => {
    console.log(data);
    displaySad(data);
});


// Happy click -> id는 post id
function onClickHappy(post_id, room_id) {

    socket.emit('send_happy', {'user': curUsername, 'postId': post_id, 'roomId': room_id});
    // console.log(curUsername)
    console.log('send successfully');

}

// Sad click -> id는 post id
function onClickSad(post_id, room_id) {

    socket.emit('send_sad', {'user': curUsername, 'postId': post_id, 'roomId': room_id});
    console.log('send successfully');

}


// 여기 post 정보 : created_at "2023-08-10", newpostId, postInput, roomId, user

async function displayHappy(happyData) {
    console.log(happyData);
    let postId = happyData['postId'];

    let happySelector = `.happy-count-${postId}`
    let happyCountElement = document.querySelector(happySelector);
    happyCountElement.innerText = happyData['happyCount'];

    let sadSelector = `.sad-count-${postId}`
    let sadCountElement = document.querySelector(sadSelector);
    sadCountElement.innerText = happyData['sadCount'];

    // 자신이 누른 버튼 확인
    if (happyData['curHappyCount']==1) {
        happyCountElement.parentElement.classList.toggle('checked');
    }
    if (happyData['curSadCount']==1) {
        sadCountElement.parentElement.classList.toggle('checked');
    }

}

async function displaySad(sadData) {
    console.log(sadData);
    let postId = sadData['postId'];
    
    let happySelector = `.happy-count-${postId}`
    let happyCountElement = document.querySelector(happySelector);
    happyCountElement.innerText = sadData['happyCount'];

    let sadSelector = `.sad-count-${postId}`
    let sadCountElement = document.querySelector(sadSelector);
    sadCountElement.innerText = sadData['sadCount'];

    // 자신이 누른 버튼 확인
    if (sadData['curHappyCount']==1) {
        happyCountElement.parentElement.classList.toggle('checked');
    }
    if (sadData['curSadCount']==1) {
        sadCountElement.parentElement.classList.toggle('checked');
    }
}


// id = newPostId
function onClickDelete(post_id, room_id) {
    socket.emit('send_delete', {'postId':post_id, 'roomId':room_id})
    console.log(post_id, room_id)
    console.log('send_successfully')
}

socket.on('deleted_post', async (data) => {
    deletedPost(data);
});

async function deletedPost(deletedData) {
    let postId = deletedData['postId']

    let delSelector = `.post-container-${postId}`;
    let delPostContainer = document.querySelector(delSelector);
    delPostContainer.remove()
}