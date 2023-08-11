let roomList = document.querySelector('.btn-room-list').getElementsByTagName('li');
roomList = Array.from(roomList);

let curRoomName = document.querySelector('.chat-name');

roomList.forEach(element => {
    const labelText = element.querySelector('.room-name').innerText;
    if(labelText === curRoomName.innerText) {
        element.querySelector('a').classList.add('selected-room');
    }
});