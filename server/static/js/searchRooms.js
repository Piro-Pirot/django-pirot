// 채팅방 검색 Ajax
const searchRoomsRequest = async (channelId, inputValue) => {
  let cookie = document.cookie;
  let csrfToken = cookie.substring(cookie.indexOf('=') + 1);

  const url = '/room/search_rooms_ajax/';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify({ channelId: channelId, inputValue: inputValue })
  });

  if (res.ok) {
    let { result_list: resultList } = await res.json();
    // 비어있는지 확인
    if (resultList !== null) {
      resultList = JSON.parse(resultList);
      searchRoomsResponse(resultList);
    }
  }
}

const searchRoomsResponse = (resultList) => {
  // 공통
  console.log(resultList);
  let roomList = Array.from(document.querySelector('.btn-room-list').getElementsByTagName('li'));

  roomList.forEach(room => {
    // 찾지 못했다면 hidden 클래스를 추가해 가림
    if (resultList.indexOf(Number(room.id)) === -1) {
      room.classList.add('room-hidden');
    } else {
      room.classList.remove('room-hidden');
    }
  });
}

const searchRoomsInput = document.getElementById('search-input');
searchRoomsInput.addEventListener('input', () => {
  searchRoomsRequest(curChannelId, searchRoomsInput.value);
});

// focus 되었을 때 전부 보이기
// searchRoomsInput.addEventListener('focusout', () => {
//   searchRoomsInput.value = '';
//   searchRoomsRequest(curChannelId, searchRoomsInput.value);
// });



// 채팅방 생성 친구 검색 Ajax
const searchNewFriendRequest = async (channelId, inputValue) => {
  let cookie = document.cookie;
  let csrfToken = cookie.substring(cookie.indexOf('=') + 1);

  const url = '/room/search_new_chat_friend_ajax/';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify({ channelId: channelId, inputValue: inputValue })
  });

  if (res.ok) {
    let { result_list: resultList } = await res.json();
    // 비어있는지 확인
    if (resultList !== null) {
      resultList = JSON.parse(resultList);
      searchNewFriendResponse(resultList);
    }
  }
}

const searchNewFriendResponse = (resultList) => {
  // 공통
  console.log(resultList);
  let inviteFriendList = Array.from(document.querySelector('.invite-ul').getElementsByTagName('li'));
  console.log(inviteFriendList);

  inviteFriendList.forEach(invite => {
    // 찾지 못했다면 hidden 클래스를 추가해 가림
    if (resultList.indexOf(Number(invite.id)) === -1) {
      invite.classList.add('invite-new-hidden');
    } else {
      invite.classList.remove('invite-new-hidden');
    }
  });
}

const searchNewFriendInput = document.getElementById('input-new-chat');
searchNewFriendInput.addEventListener('input', () => {
  searchNewFriendRequest(curChannelId, searchNewFriendInput.value);
});

// focus 해제되었을 때 전부 보이기
// searchNewFriendInput.addEventListener('focusout', () => {
//   searchNewFriendInput.value = '';
//   searchNewFriendRequest(curChannelId, searchNewFriendInput.value);
// });



// 채팅방 초대 친구 검색 Ajax
const searchFriendRequest = async (channelId, roomId, inputValue) => {
  let cookie = document.cookie;
  let csrfToken = cookie.substring(cookie.indexOf('=') + 1);

  const url = '/room/search_invite_friend_ajax/';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify({ channelId: channelId, roomId: roomId, inputValue: inputValue })
  });

  if (res.ok) {
    let { result_list: resultList } = await res.json();
    // 비어있는지 확인
    if (resultList !== null) {
      resultList = JSON.parse(resultList);
      searchFriendResponse(resultList);
    }
  }
}

const searchFriendResponse = (resultList) => {
  // 공통
  console.log(resultList);
  let inviteFriendList = Array.from(document.querySelector('.invite-friend-ul').getElementsByTagName('li'));
  console.log(inviteFriendList);

  inviteFriendList.forEach(invite => {
    // 찾지 못했다면 hidden 클래스를 추가해 가림
    if (resultList.indexOf(Number(invite.id)) === -1) {
      invite.classList.add('invite-new-hidden');
    } else {
      invite.classList.remove('invite-new-hidden');
    }
  });
}

const searchFriendInput = document.getElementById('input-new-friend');
searchFriendInput.addEventListener('input', () => {
  searchFriendRequest(curChannelId, curRoomId, searchFriendInput.value);
});

// focus 해제되었을 때 전부 보이기
// searchFriendInput.addEventListener('focusout', () => {
//   searchFriendInput.value = '';
//   searchFriendRequest(curChannelId, curRoomId, searchFriendInput.value);
// });