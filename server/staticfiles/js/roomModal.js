const roomAddModal = document.querySelector(".room-add-modal");
const roomCreateButton = document.querySelector(".btn-room-create");


// 모달 열기 
roomAddModal.style.opacity = '0';
roomCreateButton.addEventListener("click", () => {
  roomAddModal.showModal();
  roomAddModal.style.opacity = "1";

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

});

// 모달 닫기
const roomModalCloseButton = document.querySelector(".room-add-modal #close-btn");
roomModalCloseButton.addEventListener("click", () => {
  if (roomAddModal.open) {
    roomAddModal.close();
    roomAddModal.style.opacity = '0';
  }
});

//Esc 누르면 모달 opacity 초기화
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    roomAddModal.style.opacity = '0';
  }
});

//대화상대초대버튼, 채팅방 개설 버튼
const inviteButton = document.querySelector(".room-add-invite .btn-invite-member");
const inviteContent = document.querySelector(".room-add-invite");
const roomNameContent = document.querySelector(".room-add-name");
const addRoomButton = document.querySelector(".room-add-name .btn-create-group");

inviteButton.onclick = () => {
  inviteContent.style.visibility = "hidden";
  inviteContent.style.opacity = "0";
  roomNameContent.style.visibility = "visible";
  roomNameContent.style.opacity = "1";



};

addRoomButton.onclick = () => {
  roomAddModal.close();
  location.reload();
};

//뒤로가기 버튼
const backButton = document.getElementById("back-btn");

backButton.onclick = () => {
  inviteContent.style.visibility = "visible";
  inviteContent.style.opacity = "1";
  roomNameContent.style.visibility = "hidden";
  roomNameContent.style.opacity = "0";
};


document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    roomAddModal.style.opacity = '0';
    inviteContent.style.visibility = "visible";
    inviteContent.style.opacity = "1";
    roomNameContent.style.visibility = "hidden";
    roomNameContent.style.opacity = "0";
  }
});