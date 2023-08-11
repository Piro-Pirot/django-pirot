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
        let happySpan = document.createElement('span');
        happySpan.innerText = '기뻐요'; // 나중에 i 태그
        happyBtn.classList.add('happy');
        happyBtn.appendChild(happySpan);
        buttonDiv.appendChild(happyBtn); // 기뻐요

        let sadBtn = document.createElement('button');
        let sadSpan = document.createElement('span');
        sadSpan.innerText = '슬퍼요';
        sadBtn.classList.add('sad');
        sadBtn.appendChild(sadSpan);
        buttonDiv.appendChild(sadBtn); // 슬퍼요

        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.innerText = 'X';
        deleteBtn.onclick = function() {
            onClickDelete(data['newpostId']);
        };
        buttonDiv.appendChild(deleteBtn); // 삭제 버튼

        postDiv.classList.add('post-box-me');
        postContainer.classList.add('post-container-me');
    } else {
        let happyBtn = document.createElement('button');
        let happySpan = document.createElement('span');
        happySpan.innerText = '기뻐요'; // 나중에 i 태그
        happyBtn.classList.add('happy');
        happyBtn.appendChild(happySpan);
        buttonDiv.appendChild(happyBtn); // 기뻐요

        let sadBtn = document.createElement('button');
        let sadSpan = document.createElement('span');
        sadSpan.innerText = '슬퍼요';
        sadBtn.classList.add('sad');
        sadBtn.appendChild(sadSpan);
        buttonDiv.appendChild(sadBtn); // 슬퍼요

        postDiv.classList.add('post-box');
        postContainer.classList.add('post-container');
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

    // 화면에 추가
    posts.appendChild(postContainer);

    document.querySelector('.post').value = '';
    controlScrollPost();
}