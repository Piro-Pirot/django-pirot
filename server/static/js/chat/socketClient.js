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
    displayMessage(data);
});

// 익명채팅방 이벤트
socket.on('display_secret_message', async (data) => {
    console.log(data);
    displayMessage(data);
});

function onClickSendMessage(user, id) {
    // 서버로 메시지 전송
    const msg = document.querySelector('.input').value;
    // 아무것도 안 썼을 때 예외 처리
    if(msg === '') return;
    console.log(msg);

    socket.emit('send_message', {'msg': msg, 'file': 'delete me js', 'user': user, 'roomId': id});
    console.log('send successfully');
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
    bubbleContent.innerText = bubbleData['msg'];

    bubbleContainer.appendChild(bubbleHeader);
    bubbleContainer.appendChild(bubbleContent);

    bubbleDiv.appendChild(bubbleContainer);

    // 화면에 추가
    converations.appendChild(bubbleDiv);

    document.querySelector('.input').value = '';
    controlScroll();
}