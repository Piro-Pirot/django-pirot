// 서버와 Socket 연결 설정
const socket = io();

// 연결 성공 시 이벤트 리스너
socket.on('connect', () => {
    console.log('connect to server');
});

socket.on('display_message', (data) => {
    displayMessage(data['user'], data['msg']);
});

// 익명채팅방 이벤트
socket.on('display_secret_message', (data) => {
    displayMessage(data['nickname'], data['msg']);
});

function onClickSendMessage(user, uuid) {
    // 서버로 메시지 전송
    const msg = document.querySelector('.input').value;
    console.log(msg);

    socket.emit('send_message', {'msg': msg, 'user': user, 'roomUUID': uuid});
    console.log('send successfully');
}

function displayMessage(user, msg) {
    // 채팅방 멤버들에게 메시지 표시
    let chatContainer = document.querySelector('.conversation');
    let msgDiv = document.createElement('div');
    console.log(user);
    msgDiv.innerText = `${user} $$ ${msg}`;

    chatContainer.appendChild(msgDiv);
    document.querySelector('.input').value = '';
}