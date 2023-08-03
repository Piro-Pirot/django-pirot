// 서버와 Socket 연결 설정
const socket = io();

// 연결 성공 시 이벤트 리스너
socket.on('connect', () => {
    console.log('서버에 연결되었습니다.');
});

// 서버로부터 받은 사용자 정의 이벤트 처리
socket.on('display_message', (data) => {
    console.log('서버로부터 사용자 정의 이벤트를 받았습니다:', data);
    
    // 서버로부터 받은 데이터를 처리
    document.querySelector('.input').value = data;
});

function onClickSendMessage(user, uuid) {
    // 서버로 메시지 전송
    const msg = document.querySelector('.input').value;
    console.log(msg);

    socket.emit('send_message', {'msg': msg, 'user': user, 'roomUUID': uuid});
    console.log('send success');
}