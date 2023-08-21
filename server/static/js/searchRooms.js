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







