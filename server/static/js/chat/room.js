const chatSearchButton = document.getElementById("chat-search-btn");
const chatSearchInput = document.getElementById("chat-name-search");


chatSearchButton.addEventListener("click", () => {
  chatSearchInput.classList.toggle("active");
  chatSearchInput.focus();
});

NOTICE = 1
async function confirmExit(user, name, room_id) {
  const is_confirmed = confirm('정말로 채팅방을 나가시겠습니까?');
  if (is_confirmed) {
    const msg = `${name}님이 채팅방을 떠났습니다.`;
    await socket.emit('send_message', { 'msg': msg, 'file': '', 'user': user, 'roomId': room_id, 'bubbleType': NOTICE });
    document.getElementById('form-exit').submit();
    return true;
  } else {
    return false;
  }
}

try {
  const inviteMemberButton = document.getElementById("chat-member-add");
  const inviteMemberModal = document.querySelector(".invite-member-modal");
  inviteMemberButton.onclick = () => {
    inviteMemberModal.showModal();
    inviteMemberModal.style.opacity = '1';


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
  const inviteRequest = async (inviteList, roomId, channelId) => {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    const url = '/room/invite_member_ajax/';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify({ inviteList: inviteList, roomId: roomId, channelId: channelId })
    });

    if (res.ok) {
      let { new_name_dic: newNameDic, inviter_name: inviterName } = await res.json();
      if (newNameDic !== null) {
        newNameDic = await JSON.parse(newNameDic);
        inviteResponse(newNameDic, inviterName);
      }
    }
  }

  const inviteResponse = (newNameDic, inviterName) => {
    let inviteMsg = `${inviterName}님이 `;
    for (let i = 0; i < Object.keys(newNameDic).length - 1; i++) {
      inviteMsg += `${newNameDic[i]}님, `
    }
    inviteMsg += `${newNameDic[Object.keys(newNameDic).length - 1]}님을 초대하였습니다.`

    socket.emit('send_message', { 'msg': inviteMsg, 'file': 'delete me js', 'user': curUsername, 'roomId': curRoomId, 'bubbleType': NOTICE });

    // 모달 닫기
    inviteMemberModal.close();
    inviteMemberModal.style.opacity = '0';
    document.getElementById('form-invite-member').submit();
  }

  function inviteSocket() {
    const friendsCheckboxList = document.querySelectorAll('.checkbox-invite');
    let inviteList = [];
    friendsCheckboxList.forEach(element => {
      if (element.checked) {
        inviteList.push(element.name);
      }
    });
    inviteRequest(inviteList, curRoomId, curChannelId);
  }
} catch (e) {
  console.log('개인채팅방에는 초대버튼이 존재하지 않아요')
};

const codeSnippet = document.getElementById("codeIcon");
const codeInput = document.querySelector(".code-input");
const textInput = document.querySelector(".chat-input .input");

codeSnippet.onclick = () => {
  codeInput.classList.toggle("active");
  textInput.classList.toggle("inactive");
};

// 채팅방 개설한 사람이 볼 수 있는 채팅방 설정
const btnRoomSetting = document.getElementById('room-owner-setting');
const modalRoomSetting = document.querySelector('.modal-room-setting');
btnRoomSetting.onclick = () => {
  modalRoomSetting.showModal();
  modalRoomSetting.style.opacity = '1';
}

const closeSettingButton = document.querySelector(".modal-room-setting #close-btn");
closeSettingButton.addEventListener("click", () => {
  modalRoomSetting.close();
  modalRoomSetting.style.opacity = '0';
});

// Esc 누르면 모달의 opacity를 0으로 초기화 시킴
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    modalRoomSetting.style.opacity = '0';
  }
});

/* 이름 편집 */
const btnEditRoomName = document.querySelector('.room-name-container .ri-edit-line');
const inputRoomName = document.querySelector('.edit-room-name');
btnEditRoomName.onclick = () => {
  if (inputRoomName.disabled == true) {
    inputRoomName.disabled = false;
    inputRoomName.focus();
    inputRoomName.select();
  } else {
    inputRoomName.disabled = true;
  }
}

/* 사진 미리보기 */
const inputImg = document.querySelector('.room-img');
function readURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      inputImg.src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    inputImg.src = "";
  }
}