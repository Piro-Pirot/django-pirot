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


socket.on('display_message', async (data) => {
    console.log(data);
    const offsetH = displayMessage(data);
    // 스크롤을 너무 많이 올린 게 아니라면 맨 아래로
    if(calcScroll() <= 650 + offsetH) {
        controlScroll();
    }
});

// 익명채팅방 이벤트
socket.on('display_secret_message', async (data) => {
    console.log(data);
    const offsetH = displayMessage(data);
    
    if(calcScroll() <= 800) {
        controlScroll();
    }
});

function onClickSendMessage(user, id) {
    // 서버로 메시지 전송
    const msg = document.querySelector('.input').value;
    // 아무것도 안 썼을 때 예외 처리
    if(msg === '') return;
    console.log(msg);

    controlScroll();

    socket.emit('send_message', {'msg': msg, 'file': 'delete me js', 'user': user, 'roomId': id});
    console.log('send successfully');

    document.querySelector('.input').value = null;
}


// 말풍선 표시
function displayMessage(bubbleData) {
    console.log(bubbleData);
    // 내가 방금 보낸 말풍선 표시
    let bubbleDiv = document.createElement('div');
    let bubbleContainer = document.createElement('div');

    if(bubbleData['user'] == curUsername) {
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

    let profileImg = document.createElement('img');
    profileImg.setAttribute('src', bubbleData['img']);

    let nameLabel = document.createElement('label');
    if(curRoomType == 1) {
        // 익명 질문 방이면
        nameLabel.innerText = bubbleData['nickname'];
    } else {
        nameLabel.innerText = bubbleData['user'];
    }
    nameLabel.classList.add('bubble-username');

    bubbleHeader.appendChild(profileImg);
    bubbleHeader.appendChild(nameLabel);

    // 내용
    let bubbleContent = document.createElement('div');
    bubbleContent.classList.add('bubble-content');
    bubbleContent.innerHTML = bubbleData['msg'];

    bubbleContainer.appendChild(bubbleHeader);
    bubbleContainer.appendChild(bubbleContent);

    bubbleDiv.appendChild(bubbleContainer);

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
        sadImg.classList.add('ri-emotion-unhappy-line');
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
        deleteBtn.classList.add('delete');
        deleteBtn.innerText = 'X';
        deleteBtn.onclick = function() {
            onClickDelete(postData['newpostId'], postData['roomId']);
        };
        buttonDiv.appendChild(deleteBtn); // 삭제 버튼

        postDiv.classList.add('post-box-me');
        postContainer.classList.add('post-container-me');
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
        sadImg.classList.add('ri-emotion-unhappy-line');
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

    postContainer.appendChild(postTime);
    postContainer.appendChild(postDiv);
    postContainer.appendChild(buttonDiv);

    postContainer.classList.add(`post-container-${postData['newpostId']}`);
    // 화면에 추가
    posts.appendChild(postContainer);

    document.querySelector('.post').value = '';
    // controlScrollPost();
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

    // 여기서 할 수 있ㅇ르 것 같은데!!
    if (sadCountElement.classList.contains('checked')) {
        sadCountElement.classList.toggle('checked'); //있으면 없애고
        happyCountElement.classList.toggle('checked'); //얘는 없을 거니까 만듦
    } else {
        happyCountElement.classList.toggle('checked');
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

    if (happyCountElement.classList.contains('checked')) {
        happyCountElement.classList.toggle('checked');
        sadCountElement.classList.toggle('checked');
    } else {
        sadCountElement.classList.toggle('checked');
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