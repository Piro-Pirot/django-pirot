const chatSearchButton = document.getElementById("chat-search-btn");
const chatSearchInput = document.getElementById("chat-name-search");

chatSearchButton.addEventListener("click", () => {
  chatSearchInput.classList.toggle("active");
  chatSearchInput.focus();
});

NOTICE = 1;
async function confirmExit(user, name, room_id) {
  const is_confirmed = confirm("정말로 채팅방을 나가시겠습니까?");
  if (is_confirmed) {
    const msg = `${name}님이 채팅방을 떠났습니다.`;
    await socket.emit("send_message", {
      msg: msg,
      file: "",
      user: user,
      roomId: room_id,
      bubbleType: NOTICE,
    });
    document.getElementById("form-exit").submit();
    return true;
  } else {
    return false;
  }
}

const inviteMemberModal = document.querySelector(".invite-member-modal");

try {
  const inviteMemberButton = document.getElementById("chat-member-add");
  inviteMemberButton.onclick = () => {
    inviteMemberModal.showModal();
    inviteMemberModal.style.opacity = "1";

    // 채팅방 초대 친구 검색 Ajax
    const searchFriendRequest = async (channelId, roomId, inputValue) => {
      let cookie = document.cookie;
      let csrfToken = cookie.substring(cookie.indexOf("=") + 1);

      const url = "/room/search_invite_friend_ajax/";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          channelId: channelId,
          roomId: roomId,
          inputValue: inputValue,
        }),
      });

      if (res.ok) {
        let { result_list: resultList } = await res.json();
        // 비어있는지 확인
        if (resultList !== null) {
          resultList = JSON.parse(resultList);
          searchFriendResponse(resultList);
        }
      }
    };

    const searchFriendResponse = (resultList) => {
      // 공통
      console.log(resultList);
      let inviteFriendList = Array.from(
        document.querySelector(".invite-friend-ul").getElementsByTagName("li")
      );
      console.log(inviteFriendList);

      inviteFriendList.forEach((invite) => {
        // 찾지 못했다면 hidden 클래스를 추가해 가림
        if (resultList.indexOf(Number(invite.id)) === -1) {
          invite.classList.add("invite-new-hidden");
        } else {
          invite.classList.remove("invite-new-hidden");
        }
      });
    };

    const searchFriendInput = document.getElementById("input-new-friend");
    searchFriendInput.addEventListener("input", () => {
      searchFriendRequest(curChannelId, curRoomId, searchFriendInput.value);
    });

    // focus 해제되었을 때 전부 보이기
    // searchFriendInput.addEventListener('focusout', () => {
    //   searchFriendInput.value = '';
    //   searchFriendRequest(curChannelId, curRoomId, searchFriendInput.value);
    // });
  };
} catch {
  console.log("사이즈를 줄여");
}

try {
  const inviteMemberButton = document.getElementById("chat-member-add-mob");
  inviteMemberButton.onclick = () => {
    inviteMemberModal.showModal();
    inviteMemberModal.style.opacity = "1";

    // 채팅방 초대 친구 검색 Ajax
    const searchFriendRequest = async (channelId, roomId, inputValue) => {
      let cookie = document.cookie;
      let csrfToken = cookie.substring(cookie.indexOf("=") + 1);

      const url = "/room/search_invite_friend_ajax/";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
          channelId: channelId,
          roomId: roomId,
          inputValue: inputValue,
        }),
      });

      if (res.ok) {
        let { result_list: resultList } = await res.json();
        // 비어있는지 확인
        if (resultList !== null) {
          resultList = JSON.parse(resultList);
          searchFriendResponse(resultList);
        }
      }
    };

    const searchFriendResponse = (resultList) => {
      // 공통
      console.log(resultList);
      let inviteFriendList = Array.from(
        document.querySelector(".invite-friend-ul").getElementsByTagName("li")
      );
      console.log(inviteFriendList);

      inviteFriendList.forEach((invite) => {
        // 찾지 못했다면 hidden 클래스를 추가해 가림
        if (resultList.indexOf(Number(invite.id)) === -1) {
          invite.classList.add("invite-new-hidden");
        } else {
          invite.classList.remove("invite-new-hidden");
        }
      });
    };

    const searchFriendInput = document.getElementById("input-new-friend");
    searchFriendInput.addEventListener("input", () => {
      searchFriendRequest(curChannelId, curRoomId, searchFriendInput.value);
    });

    // focus 해제되었을 때 전부 보이기
    // searchFriendInput.addEventListener('focusout', () => {
    //   searchFriendInput.value = '';
    //   searchFriendRequest(curChannelId, curRoomId, searchFriendInput.value);
    // });

    //버거메뉴 닫기
    chatBurgerButton.className = "ri-menu-line";
    chatBurgerList.style.visibility = "hidden";
    chatBurgerList.style.opacity = "0";
  };
} catch {
  console.log("사이즈를 늘려");
}

const inviteMemberCloseButton = document.querySelector(
  ".invite-member-modal #close-btn"
);
inviteMemberCloseButton.onclick = () => {
  inviteMemberModal.close();
  inviteMemberModal.style.opacity = "0";
};

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    inviteMemberModal.close();
    inviteMemberModal.style.opacity = "0";
  }
});

// 채팅방 초대 Ajax
const inviteRequest = async (inviteList, roomId, channelId) => {
  let cookie = document.cookie;
  let csrfToken = cookie.substring(cookie.indexOf("=") + 1);
  const url = "/room/invite_member_ajax/";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({
      inviteList: inviteList,
      roomId: roomId,
      channelId: channelId,
    }),
  });

  if (res.ok) {
    let { new_name_dic: newNameDic, inviter_name: inviterName } =
      await res.json();
    if (newNameDic !== null) {
      newNameDic = await JSON.parse(newNameDic);
      inviteResponse(newNameDic, inviterName);
    }
  }
};

const inviteResponse = (newNameDic, inviterName) => {
  let inviteMsg = `${inviterName}님이 `;
  for (let i = 0; i < Object.keys(newNameDic).length - 1; i++) {
    inviteMsg += `${newNameDic[i]}님, `;
  }
  inviteMsg += `${
    newNameDic[Object.keys(newNameDic).length - 1]
  }님을 초대하였습니다.`;

  socket.emit("send_message", {
    msg: inviteMsg,
    file: "delete me js",
    user: curUsername,
    roomId: curRoomId,
    bubbleType: NOTICE,
  });

  // 모달 닫기
  inviteMemberModal.close();
  inviteMemberModal.style.opacity = "0";
  document.getElementById("form-invite-member").submit();
};

function inviteSocket() {
  const friendsCheckboxList = document.querySelectorAll(".checkbox-invite");
  let inviteList = [];
  friendsCheckboxList.forEach((element) => {
    if (element.checked) {
      inviteList.push(element.name);
    }
  });
  inviteRequest(inviteList, curRoomId, curChannelId);
}

const codeSnippet = document.getElementById("codeIcon");
const codeInput = document.querySelector(".code-input");
const textInput = document.querySelector(".chat-input .input");

codeSnippet.onclick = () => {
  codeInput.classList.toggle("active");
  textInput.classList.toggle("inactive");
};

// 채팅방 내 아이콘 버거 메뉴화
const chatBurgerButton = document.getElementById("chatBurger");
chatBurgerButton.className = "ri-menu-line";
const chatBurgerList = document.getElementById("chatBurgerList");
chatBurgerList.style.visibility = "hidden";
chatBurgerList.style.opacity = "1";
try {
  chatBurgerButton.addEventListener("click", () => {
    if (chatBurgerList.style.visibility == "hidden") {
      chatBurgerButton.className = "ri-close-line";
      chatBurgerList.style.visibility = "visible";
      chatBurgerList.style.opacity = "1";
    } else if (chatBurgerList.style.visibility == "visible") {
      chatBurgerButton.className = "ri-menu-line";
      chatBurgerList.style.visibility = "hidden";
      chatBurgerList.style.opacity = "0";
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      chatBurgerButton.className = "ri-menu-line";
      chatBurgerList.style.visibility = "hidden";
      chatBurgerList.style.opacity = "0";
    }
  });
} catch {
  console.log("화면을 줄여야 버거메뉴가 보여요");
}

// 모바일 반응형 채팅방 설정 버튼
chatSettingButtonMob.onclick = () => {
  //설정 모달 뜨기
  chatSettingModal.showModal();
  chatSettingModal.style.opacity = "1";
  //버거메뉴 닫기
  chatBurgerButton.className = "ri-menu-line";
  chatBurgerList.style.visibility = "hidden";
  chatBurgerList.style.opacity = "0";
};

const searchInputMob = document.getElementById("chat-name-search-mob");
function searchInputMobOpen() {
  searchInputMob.style.visibility = "visible";
  searchInputMob.style.opacity = "1";
}
function searchInputMobClose() {
  searchInputMob.style.visibility = "hidden";
  searchInputMob.style.opacity = "0";
}

const chatName = document.querySelector(".chat-name-name");
// 모바일 반응형 채팅방 검색버튼
try {
  const searchBtnMob = document.getElementById("chat-search-btn-mob");
  searchBtnMob.onclick = () => {
    // if (searchInputMob.style.visibility == 'hidden') {
    //   searchInputMobOpen();
    // }
    // else if (searchInputMob.style.visibility == 'visible') {
    //   searchInputMobClose();
    //   chatBurgerButton.className = 'ri-menu-line';
    //   chatBurgerList.style.visibility = 'hidden';
    //   chatBurgerList.style.opacity = '0';
    // } --> 왜 안되냐????????????
    if (searchInputMob.classList.contains("live")) {
      chatName.style.visibility = "visible";
    } else {
      searchInputMob.focus();
      chatName.style.visibility = "hidden";
    }
    searchInputMob.classList.toggle("live");
  };
} catch {
  console.log("창을 늘려");
}

// // 검색창을 제외한 다른 곳 눌렀을 떄 검색창 닫히기
// chatNameContainer.addEventListener('click', (event) => {
//   if (searchInputMob.style.visibility == 'visible') {
//     if (!searchInputMob.contains(event.target)) {
//       searchInputMobClose();
//     }
//   }
// });
