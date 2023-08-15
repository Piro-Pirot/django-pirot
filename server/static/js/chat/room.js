const chatSearchButton = document.getElementById("chat-search-btn");
const chatSearchInput = document.getElementById("chat-name-search");


chatSearchButton.addEventListener("click", () => {
  chatSearchInput.classList.toggle("active");
  chatSearchInput.focus();
});

NOTICE = 1
async function confirmExit(user, name, room_id) {
  const is_confirmed = confirm('정말로 채팅방을 나가시겠습니까?');
  if(is_confirmed) {
    const msg = `${name}님이 채팅방을 떠났습니다.`;
    await socket.emit('send_message', {'msg': msg, 'file': '', 'user': user, 'roomId': room_id, 'bubbleType': NOTICE});
    document.getElementById('form-exit').submit();
    return true;
  } else {
    return false;
  }
}

const inviteMemberButton = document.getElementById("chat-member-add");
const inviteMemberModal = document.querySelector(".invite-member-modal");
inviteMemberButton.onclick = () => {
  inviteMemberModal.showModal();
  inviteMemberModal.style.opacity = '1';
};

const inviteMemberCloseButton = document.querySelector(".invite-member-modal #close-btn");
inviteMemberCloseButton.onclick = () => {
  inviteMemberModal.close();
  inviteMemberModal.style.opacity = '0';
};

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    inviteMemberModal.close();
    inviteMemberModal.style.opacity = '0';
  };
});

// 채팅방 초대 Ajax
const inviteRequest = async(inviteList, roomId, channelId) => {
  const url = '/room/invite_member_ajax/';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify({inviteList: inviteList, roomId: roomId, channelId: channelId})
  });

  if(res.ok) {
    let {new_name_dic: newNameDic, inviter_name: inviterName} = await res.json();
    if(newNameDic !== null) {
      newNameDic = await JSON.parse(newNameDic);
      inviteResponse(newNameDic, inviterName);
    }
  }
}

CHAT = 0
NOTICE = 1
const inviteResponse = (newNameDic, inviterName) => {
  let inviteMsg = `${inviterName}님이 `;
  for(let i = 0; i < Object.keys(newNameDic).length - 1; i++) {
    inviteMsg += `${newNameDic[i]}님, `
  }
  inviteMsg += `${newNameDic[Object.keys(newNameDic).length - 1]}님을 초대하였습니다.`

  socket.emit('send_message', {'msg': inviteMsg, 'file': 'delete me js', 'user': curUsername, 'roomId': curRoomId, 'bubbleType': NOTICE});

  // 모달 닫기
  inviteMemberModal.close();
  inviteMemberModal.style.opacity = '0';
  document.getElementById('form-invite-member').submit();
}

function inviteSocket() {
  const friendsCheckboxList = document.querySelectorAll('.checkbox-invite');
  let inviteList = [];
  friendsCheckboxList.forEach(element => {
    if(element.checked) {
      inviteList.push(element.name);
    }
  });
  inviteRequest(inviteList, curRoomId, curChannelId);
}