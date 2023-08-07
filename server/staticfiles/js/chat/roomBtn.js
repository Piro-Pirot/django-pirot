let roomList = document.querySelector('.btn-room-list').getElementsByTagName('li');
roomList = Array.from(roomList);

let curRoomName = document.querySelector('.chat-name');

roomList.forEach(element => {
    const labelText = element.getElementsByTagName('label')[0].innerText;
    if(labelText === curRoomName.innerText) {
        element.querySelector('.btn-room').classList.add('selected-room');
    }
});