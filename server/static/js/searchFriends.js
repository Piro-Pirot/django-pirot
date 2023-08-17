// 친구 검색 Ajax
const searchFriendsRequest = async (channelId, inputValue) => {
  let cookie = document.cookie;
  let csrfToken = cookie.substring(cookie.indexOf('=') + 1);

  const url = '/staff/search_friends_ajax/';
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
      searchFriendsResponse(resultList);
    }
  }
}

const searchFriendsResponse = (resultList) => {
  // 공통
  let friendList = Array.from(document.querySelector('.btn-friend-list').getElementsByTagName('li'));

  friendList.forEach(friend => {
    // 찾지 못했다면 hidden 클래스를 추가해 가림
    if (resultList.indexOf(Number(friend.id)) === -1) {
      friend.classList.add('friend-hidden');
    } else {
      friend.className = 'btn-friend-container friend-container';
    }
  });
}

const searchFriendsInput = document.getElementById('search-input');
searchFriendsInput.addEventListener('input', () => {
  searchFriendsRequest(curChannelId, searchFriendsInput.value);
});

// focus 해제되었을 때 전부 보이기
// searchFriendsInput.addEventListener('focusout', () => {
//   searchFriendsInput.value = '';
//   searchFriendsRequest(curChannelId, searchFriendsInput.value);
// });