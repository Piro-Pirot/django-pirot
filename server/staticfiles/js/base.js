// 아이콘 바 클릭 시 fill
const friendsIcon = document.querySelector(".friend-icon");
const roomIcon = document.querySelector(".room-icon");
friendsIcon.addEventListener("click", () => {
  friendsIcon.classList.replace("ri-team-line", "ri-team-fill");
  roomIcon.classList.replace("ri-chat-3-fill", "ri-chat-3-line");
});
roomIcon.addEventListener("click", () => {
  roomIcon.classList.replace("ri-chat-3-line", "ri-chat-3-fill");
  friendsIcon.classList.replace("ri-team-fill", "ri-team-line");
});




let searchButton = document.getElementById("search-btn");
let channelName = document.getElementById("channel-name");
let searchInput = document.getElementById("search-input");

searchInput.style.visibility = "hidden";
searchInput.style.opacity = "0";

searchButton.onclick = () => {
  if (searchInput.style.visibility === "hidden") {
    channelName.style.visibility = "hidden";
    channelName.style.opacity = "0";
    searchInput.style.visibility = "visible";
    searchInput.style.opacity = "1";
    searchInput.focus();
  }
  else if (searchInput.style.visibility === "visible") {
    channelName.style.visibility = "visible";
    channelName.style.opacity = "1";
    searchInput.style.visibility = "hidden";
    searchInput.style.opacity = "0";
  }
};

let searchBox = document.getElementById("search");
window.addEventListener("click", (event) => {
  if (!searchBox.contains(event.target)) {
    channelName.style.visibility = "visible";
    channelName.style.opacity = "1";
    searchInput.style.visibility = "hidden";
    searchInput.style.opacity = "0"
  };
});


/* select option 새로고침 되어도 유지 */



//channel이름 selector 구현
let selectedChannel = document.querySelector(".select-btn span");
let selectButton = document.querySelector(".select-btn");
let channelOptionsList = document.querySelector(".select-options");
let channelOptions = document.querySelectorAll(".select-options li");


channelOptions.forEach(option => {
  option.addEventListener("click", () => {
    selectedChannel.innerHTML = option.innerHTML;
    channelOptionsList.classList.toggle("active");
    window.open(`/room/${option.id}/main`, '_self');
  });
  if (option.id == curChannelId) {
    selectedChannel.innerText = option.innerText;
  }
});

selectButton.addEventListener("click", () => {
  channelOptionsList.classList.toggle("active");
  selectButton.classList.toggle("color-stay");
})


/* 정말로 확인 모달 띄우는 함수 */
function showConfirmModal(content) {
  const confirmModal = document.querySelector('.confirm-modal');
  let modalContent = document.querySelector('.confirm-modal-content');
  modalContent.innerText = content;
  confirmModal.className = 'confirm-modal on';
  confirmModal.style.display = 'block';
  confirmModal.style.opacity = '1';
}

/* 정말로 확인 모달 닫는 함수 */
function closeConfirmModal() {
  const confirmModal = document.querySelector('.confirm-modal');
  confirmModal.className = 'confirm-modal';
  confirmModal.style.display = 'none';
  confirmModal.style.opacity = '0';
}


const middleCloseOpenButton = document.getElementById("middleCloseOpen");
const middleChannelSpan = document.querySelector('.select-btn > span');
const middleChannelIcon = document.querySelector('.select-btn > i');

// const chatContainer = document.querySelector(".chat-conversation-container");
const chatSection = document.querySelector('.chat-section');
const middleSection = document.querySelector(".middle-section");

const middleSearchBox = document.querySelector('.search-box')
const searchIcon = document.querySelector('.search-box > i');
const middleContent = document.querySelector('.middle-section-content');

chatSection.style.transition = '0.2s';
middleSection.style.transition = '0.2s';

//middle section 닫기 함수(768px 초과의 경우)
function midClose() {
  middleSection.style.width = '3rem';

  middleSearchBox.style.display = 'none';
  middleContent.style.display = 'none';
  try {
    const createRoom = document.querySelector('.btn-room-create');
    createRoom.style.display = 'none';
  } catch {
    console.log('친구리스트에는 채팅방 추가 버튼이 없어요~')
  }

  chatSection.style.width = 'calc(100vw - 7rem)';
  middleCloseOpenButton.className = 'ri-arrow-right-double-line';
};


//middle section 닫기 함수(768px 이하의 경우)
function midCloseMob() {
  middleSection.style.width = '3rem';

  middleSearchBox.style.display = 'none';
  middleContent.style.display = 'none';
  try {
    const createRoom = document.querySelector('.btn-room-create');
    createRoom.style.display = 'none';
  } catch {
    console.log('친구리스트에는 채팅방 추가 버튼이 없어요~')
  }

  chatSection.style.width = '100vw';
  middleCloseOpenButton.className = 'ri-arrow-right-double-line';
};

//middle section 열기 함수(768px 초과의 경우)
function midOpen() {
  middleSection.style.width = '20rem';

  middleSearchBox.style.display = 'flex';
  middleContent.style.display = 'block';
  try {
    const createRoom = document.querySelector('.btn-room-create');
    createRoom.style.display = 'block';
  } catch {
    console.log('친구리스트에는 채팅방 추가 버튼이 없어요~');
  }

  chatSection.style.width = 'calc(100vw - 24rem)';
  middleCloseOpenButton.className = 'ri-arrow-left-double-line';
};

//middle section 열기 함수(768px 이하의 경우)
function midOpenMob() {
  middleSection.style.width = '20rem';

  middleSearchBox.style.display = 'flex';
  middleContent.style.display = 'block';
  try {
    const createRoom = document.querySelector('.btn-room-create');
    createRoom.style.display = 'block';
  } catch {
    console.log('친구리스트에는 채팅방 추가 버튼이 없어요~');
  }
};


//middle section 열고 닫기 버튼 눌렀을 때 실행 함수
middleCloseOpenButton.addEventListener("click", () => {
  if (window.innerWidth > 768) {
    if (middleCloseOpenButton.className == 'ri-arrow-left-double-line') {
      midClose();
    }
    else {
      midOpen();
    };
  }
});


//창 크기 조절하였을 때 middle section 열고 닫기
window.addEventListener("resize", () => {
  if (window.innerWidth > 1000) {
    midOpen();
    middleSection.classList.remove("open")
  }
  else if (window.innerWidth <= 1000 && window.innerWidth > 768) {
    midClose();
    middleSection.classList.remove("open")
  }
  else {
    midOpenMob();
    chatSection.style.width = '100vw';
  }
});

//페이지 리로드 시 middle section 열고 닫기 유무 고정
window.onload = () => {
  if (window.innerWidth > 1000) {
    midOpen();
    boardOpen();
  }
  else if (window.innerWidth > 768) {
    midClose();
    boardClose();
  }
  else {
    middleSection.style.width = '20rem';

    middleSearchBox.style.display = 'flex';
    middleContent.style.display = 'block';
    try {
    const createRoom = document.querySelector('.btn-room-create');
    createRoom.style.display = 'block';
    } catch {
    console.log('친구리스트에는 채팅방 추가 버튼이 없어요~');
    }
    chatSection.style.width = '100vw';
    boardClose();
  };
};


const mobMenuButton = document.querySelector(".mob-menu-icon");
//(768px 이하) 모바일 메뉴버튼
mobMenuButton.addEventListener("click", () => {
  if (window.innerWidth <= 768) {
    middleSection.classList.toggle("open");
  }
});








//middle section 닫고 여는 함수
// function closeOpenMidSection() {
//   //mid section이 열려있는 경우
//   if (middleCloseOpenButton.className == 'ri-arrow-left-double-line') {
//     // 닫기 시도 중
//     middleSection.style.width = '3rem';
//     chatContainer.style.width = 'calc(100% - 1rem)';
//     chatSection.style.width = 'calc(100vw - 0.5rem)';
//     middleChannelSpan.classList.add('hide-element');
//     middleChannelSpan.style.display = 'none';
//     middleChannelIcon.classList.add('hide-element');
//     middleChannelIcon.style.display = 'none';
//     middleSearchBox.classList.add('hide-element');
//     middleSearchBox.style.display = 'none';
//     searchIcon.classList.add('hide-element');
//     searchIcon.style.display = 'none';
//     middleContent.classList.add('hide-element');
//     middleContent.style.display = 'none';

//     try {
//       createRoom.classList.add('hide-element');
//       createRoom.style.display = 'none';
//     } catch {
//       console.log('not found');
//     };
  
//     // 화살표 방향 바꿔줌
//     middleCloseOpenButton.className = 'ri-arrow-right-double-line';
//   }
//   //mid section이 닫혀있는 경우
//   else {
  
//     if (window.innerWidth <= 768) {

//       try {
//       //board가 닫혀있는 경우
//       document.getElementById('boardOpen');
//       chatSection.style.width = 'calc(100vw - 20rem)';
//       document.querySelector('.chat-conversation-container').style.width = 'calc(100% - 3rem)';
//       } catch {
//       //board가 열려있는 경우
//       chatSection.style.width = 'calc(100vw - 20rem)';
//       };

//       middleSection.style.width = '20rem';
//       middleChannelSpan.classList.remove('hide-element');
//       middleChannelSpan.style.display = 'block';
//       middleChannelIcon.classList.remove('hide-element');
//       middleChannelIcon.style.display = 'block';
//       middleSearchBox.classList.remove('hide-element');
//       middleSearchBox.style.display = 'flex';
//       searchIcon.classList.remove('hide-element');
//       searchIcon.style.display = 'block';
//       middleContent.classList.remove('hide-element');
//       middleContent.style.display = 'block';

//       try {
//         createRoom.classList.remove('hide-element');
//         createRoom.style.display = 'block';
//       } catch {
//         console.log('not found!');
//       };
    
//       middleCloseOpenButton.className = 'ri-arrow-left-double-line';
//     }

//     else {
//       try {
//         //board가 닫혀있는 경우
//         document.getElementById('boardOpen');
//         chatSection.style.width = 'calc(100vw - 24rem)';
//         document.querySelector('.chat-conversation-container').style.width = 'calc(100% - 3rem)';
//         } catch {
//         //board가 열려있는 경우
//         chatSection.style.width = 'calc(100vw - 24rem)';
//         };
  
//         middleSection.style.width = '20rem';
//         middleChannelSpan.classList.remove('hide-element');
//         middleChannelSpan.style.display = 'block';
//         middleChannelIcon.classList.remove('hide-element');
//         middleChannelIcon.style.display = 'block';
//         middleSearchBox.classList.remove('hide-element');
//         middleSearchBox.style.display = 'flex';
//         searchIcon.classList.remove('hide-element');
//         searchIcon.style.display = 'block';
//         middleContent.classList.remove('hide-element');
//         middleContent.style.display = 'block';
  
//         try {
//           createRoom.classList.remove('hide-element');
//           createRoom.style.display = 'block';
//         } catch {
//           console.log('not found!');
//         };
      
//         middleCloseOpenButton.className = 'ri-arrow-left-double-line';
//     };
//   };
// };

// //mid section 줄이기 버튼 눌렀을 때
// middleCloseOpenButton.onclick = () => {
//   closeOpenMidSection();
// };

// //창 줄이면 자동으로 mid section 줄어들고 창 늘이면 다시 펼치기
// window.addEventListener("resize", () => {
//   if (window.innerWidth <= 1000) {
//     middleSection.style.width = '3rem';
//     chatContainer.style.width = 'calc(100% - 1rem)';
//     chatSection.style.width = 'calc(100vw - 0.5rem)';
//     middleChannelSpan.classList.add('hide-element');
//     middleChannelSpan.style.display = 'none';
//     middleChannelIcon.classList.add('hide-element');
//     middleChannelIcon.style.display = 'none';
//     middleSearchBox.classList.add('hide-element');
//     middleSearchBox.style.display = 'none';
//     searchIcon.classList.add('hide-element');
//     searchIcon.style.display = 'none';
//     middleContent.classList.add('hide-element');
//     middleContent.style.display = 'none';

//     try {
//       createRoom.classList.add('hide-element');
//       createRoom.style.display = 'none';
//     } catch {
//       console.log('not found');
//     };
  
//     // 화살표 방향 바꿔줌
//     middleCloseOpenButton.className = 'ri-arrow-right-double-line';
//   }
//   else {
//     chatContainer.style.width = 'calc(100% - 18rem)';
  
//     try {
//       document.getElementById('boardOpen');
//       chatSection.style.width = 'calc(100vw - 24rem)';
//       document.querySelector('.chat-conversation-container').style.width = 'calc(100vw - 30rem)';
//     } catch {
//       chatSection.style.width = 'calc(100vw - 24rem)';
//     };

//     middleSection.style.width = '20rem';
//     middleChannelSpan.classList.remove('hide-element');
//     middleChannelSpan.style.display = 'block';
//     middleChannelIcon.classList.remove('hide-element');
//     middleChannelIcon.style.display = 'block';
//     middleSearchBox.classList.remove('hide-element');
//     middleSearchBox.style.display = 'flex';
//     searchIcon.classList.remove('hide-element');
//     searchIcon.style.display = 'block';
//     middleContent.classList.remove('hide-element');
//     middleContent.style.display = 'block';

//     try {
//       createRoom.classList.remove('hide-element');
//       createRoom.style.display = 'block';
//     } catch {
//       console.log('not found!');
//     };
  
//     middleCloseOpenButton.className = 'ri-arrow-left-double-line';
//   };
// });

// //페이지 리로드 됐을 때 창 사이즈에 맞게 middle section 접거나 핀 상태 유지
// window.onload = () => {
//   if (window.innerWidth <= 1000) {
//     middleSection.style.width = '3rem';
//     chatContainer.style.width = 'calc(100% - 1rem)';
//     chatSection.style.width = 'calc(100vw - 0.5rem)';
//     middleChannelSpan.classList.add('hide-element');
//     middleChannelSpan.style.display = 'none';
//     middleChannelIcon.classList.add('hide-element');
//     middleChannelIcon.style.display = 'none';
//     middleSearchBox.classList.add('hide-element');
//     middleSearchBox.style.display = 'none';
//     searchIcon.classList.add('hide-element');
//     searchIcon.style.display = 'none';
//     middleContent.classList.add('hide-element');
//     middleContent.style.display = 'none';

//     try {
//       createRoom.classList.add('hide-element');
//       createRoom.style.display = 'none';
//     } catch {
//       console.log('not found');
//     };
  
//     // 화살표 방향 바꿔줌
//     middleCloseOpenButton.className = 'ri-arrow-right-double-line';
//   }
//   else {
//     chatContainer.style.width = 'calc(100% - 18rem)';
  
//     try {
//       document.getElementById('boardOpen');
//       chatSection.style.width = 'calc(100vw - 24rem)';
//       document.querySelector('.chat-conversation-container').style.width = 'calc(100vw - 30rem)';
//     } catch {
//       chatSection.style.width = 'calc(100vw - 24rem)';
//     };

//     middleSection.style.width = '20rem';
//     middleChannelSpan.classList.remove('hide-element');
//     middleChannelSpan.style.display = 'block';
//     middleChannelIcon.classList.remove('hide-element');
//     middleChannelIcon.style.display = 'block';
//     middleSearchBox.classList.remove('hide-element');
//     middleSearchBox.style.display = 'flex';
//     searchIcon.classList.remove('hide-element');
//     searchIcon.style.display = 'block';
//     middleContent.classList.remove('hide-element');
//     middleContent.style.display = 'block';

//     try {
//       createRoom.classList.remove('hide-element');
//       createRoom.style.display = 'block';
//     } catch {
//       console.log('not found!');
//     };
  
//     middleCloseOpenButton.className = 'ri-arrow-left-double-line';
//   };
// };



















// if (matchMedia("screen and (min-width: 1200px)").matches) {
//   // 채널 친구 목록 창 열고 닫기
//   const middleCloseOpenButton = document.getElementById("middleCloseOpen");
//   const middleChannelSpan = document.querySelector('.select-btn > span');
//   const middleChannelIcon = document.querySelector('.select-btn > i');

//   const chatContainer = document.querySelector(".chat-conversation-container");
//   const chatSection = document.querySelector('.chat-section');
//   const middleSection = document.querySelector(".middle-section");

//   const middleSearchBox = document.querySelector('.search-box')
//   const searchIcon = document.querySelector('.search-box > i');
//   const middleContent = document.querySelector('.middle-section-content');
//   const createRoom = document.querySelector('.btn-room-create');

//   chatContainer.style.transition = '0.3s';
//   chatSection.style.transition = '0.3s';
//   middleSection.style.transition = '0.3s';

//   middleCloseOpenButton.onclick = () => {
//     if (middleCloseOpenButton.className == 'ri-arrow-left-double-line') {
//       // 닫기 시도 중
//       middleSection.style.width = '3rem';
//       chatContainer.style.width = 'calc(100% - 1rem)';
//       chatSection.style.width = 'calc(100vw - 0.5rem)';
//       middleChannelSpan.classList.add('hide-element');
//       middleChannelSpan.style.display = 'none';
//       middleChannelIcon.classList.add('hide-element');
//       middleChannelIcon.style.display = 'none';
//       middleSearchBox.classList.add('hide-element');
//       middleSearchBox.style.display = 'none';
//       searchIcon.classList.add('hide-element');
//       searchIcon.style.display = 'none';
//       middleContent.classList.add('hide-element');
//       middleContent.style.display = 'none';
//       try {
//         createRoom.classList.add('hide-element');
//         createRoom.style.display = 'none';
//       } catch {
//         console.log('not found');
//       }

//       // 화살표 방향 바꿔줌
//       middleCloseOpenButton.className = 'ri-arrow-right-double-line';
//     } else {
//       chatContainer.style.width = 'calc(100% - 18rem)';

//       try {
//         document.getElementById('boardOpen');
//         chatSection.style.width = 'calc(100vw - 24rem)';
//         document.querySelector('.chat-conversation-container').style.width = 'calc(100vw - 30rem)';
//       } catch {
//         chatSection.style.width = 'calc(100vw - 24rem)';
//       }
//       middleSection.style.width = '20rem';
//       middleChannelSpan.classList.remove('hide-element');
//       middleChannelSpan.style.display = 'block';
//       middleChannelIcon.classList.remove('hide-element');
//       middleChannelIcon.style.display = 'block';
//       middleSearchBox.classList.remove('hide-element');
//       middleSearchBox.style.display = 'flex';
//       searchIcon.classList.remove('hide-element');
//       searchIcon.style.display = 'block';
//       middleContent.classList.remove('hide-element');
//       middleContent.style.display = 'block';
//       try {
//         createRoom.classList.remove('hide-element');
//         createRoom.style.display = 'block';
//       } catch {
//         console.log('not found!');
//       }

//       middleCloseOpenButton.className = 'ri-arrow-left-double-line';
//     }
//   }
// }

// // 태블릿 반응형
// // 기본 middle 닫고, 보드 열어 둠
// if (matchMedia("(min-width: 768px) and (max-width: 1200px)").matches) {

//   const middleCloseOpenButton = document.getElementById("middleCloseOpen");
//   const middleChannelSpan = document.querySelector('.select-btn > span');
//   const middleChannelIcon = document.querySelector('.select-btn > i');

//   const chatContainer = document.querySelector(".chat-conversation-container");
//   const chatSection = document.querySelector('.chat-section');
//   const middleSection = document.querySelector(".middle-section");

//   const middleSearchBox = document.querySelector('.search-box')
//   const searchIcon = document.getElementById('search-btn');
//   const middleContent = document.querySelector('.middle-section-content');
//   const roomList = document.querySelector('.btn-room-list');
//   const createRoom = document.querySelector('.btn-room-create');

//   document.querySelector('.btn-send').style.fontSize = '0.7rem';

//   chatContainer.style.transition = '0.3s';
//   chatSection.style.transition = '0.3s';
//   middleSection.style.transition = '0.3s';

//   // middle 닫기
//   middleSection.style.width = '3rem';
//   chatContainer.style.width = 'calc(100% - 1rem)';
//   chatSection.style.width = 'calc(100vw - 0.5rem)';
//   middleChannelSpan.classList.add('hide-element');
//   middleChannelIcon.classList.add('hide-element');
//   middleSearchBox.classList.add('hide-element');
//   searchIcon.className = '';
//   middleContent.classList.add('hide-element');
//   try {
//     roomList.classList.add('hide-element');
//     createRoom.classList.add('hide-element');
//     const roomListEl = Array.from(roomList.getElementsByTagName('li'));
//     for (let i = 0; i < roomListEl.length; i++) {
//       roomListEl[i].style.display = 'none';
//     };
//     boardInputContainer.style.display = 'none';
//     boardOpenButton.style.visibility = "visible"
//   } catch {
//     console.log('not found!!!');
//   }

//   // 화살표 방향 바꿔줌
//   middleCloseOpenButton.className = 'ri-arrow-right-double-line';

//   // 클릭 리스너 등록
//   middleCloseOpenButton.onclick = () => {
//     if (middleCloseOpenButton.className == 'ri-arrow-left-double-line') {
//       // 닫기 시도 중
//       middleSection.style.width = '3rem';
//       chatContainer.style.width = 'calc(100% - 1rem)';
//       chatSection.style.width = 'calc(100vw - 0.5rem)';
//       middleChannelSpan.classList.add('hide-element');
//       middleChannelIcon.classList.add('hide-element');
//       middleSearchBox.classList.add('hide-element');
//       searchIcon.className = '';
//       middleContent.classList.add('hide-element');
//       try {
//         const roomListEl = Array.from(roomList.getElementsByTagName('li'));
//         for (let i = 0; i < roomListEl.length; i++) {
//           roomListEl[i].style.display = 'none';
//         };
//         roomList.classList.add('hide-element');
//         createRoom.classList.add('hide-element');
//       } catch {
//         console.log('not found!!!!');
//       }

//       // 화살표 방향 바꿔줌
//       middleCloseOpenButton.className = 'ri-arrow-right-double-line';
//     } else {
//       chatContainer.style.width = 'calc(100% - 18rem)';

//       try {
//         document.getElementById('boardOpen');
//         chatSection.style.width = 'calc(100vw - 24rem)';
//         document.querySelector('.chat-conversation-container').style.width = 'calc(100% - 18rem)';
//       } catch {
//         chatSection.style.width = 'calc(100vw - 24rem)';
//       }
//       middleSection.style.width = '20rem';
//       middleChannelSpan.classList.remove('hide-element');
//       middleChannelIcon.classList.remove('hide-element');
//       middleSearchBox.classList.remove('hide-element');
//       searchIcon.className = 'fa-solid fa-magnifying-glass';
//       middleContent.classList.remove('hide-element');
//       try {
//         roomList.classList.remove('hide-element');
//         createRoom.classList.remove('hide-element');
//         const roomListEl = Array.from(roomList.getElementsByTagName('li'));
//         for (let i = 0; i < roomListEl.length; i++) {
//           roomListEl[i].style.display = 'block';
//         };
//       } catch {
//         console.log('not found!!!!!');
//       }

//       middleCloseOpenButton.className = 'ri-arrow-left-double-line';
//     }
//   }
// }

// // 모바일 반응형
// // 기본 middle 닫고, 보드 닫음
// // middle 열면 채팅 닫고 보드 닫음
// // 보드 열면 채팅 닫고 middle 닫음
// if (matchMedia("(max-width: 768px)").matches) {
//   // 원래 쓰던 버튼 안 쓸 거임
//   const middleCloseOpenButton = document.getElementById("middleCloseOpen");
//   middleCloseOpenButton.classList.add('hide-element');
//   // 채팅방 검색 버튼 제거
//   const searchChatButton = document.getElementById('chat-search-btn');
//   searchChatButton.style.display = 'none';

//   const middleChannelSpan = document.querySelector('.select-btn > span');
//   const middleChannelIcon = document.querySelector('.select-btn > i');
//   const middleSection = document.querySelector(".middle-section");

//   const chatContainer = document.querySelector(".chat-conversation-container");
//   const chatSection = document.querySelector('.chat-section');
//   const chatContents = chatSection.childNodes;

//   const middleSearchBox = document.querySelector('.search-box')
//   const searchIcon = document.querySelector('.search-box > i');
//   const middleContent = document.querySelector('.middle-section-content');
//   const createRoom = document.querySelector('.btn-room-create');

//   // 전송 버튼 폰트 크기
//   document.querySelector('.btn-send').style.fontSize = '0.7rem';
//   // 세로 아이콘바 가리기
//   document.querySelector('.icon-bar').classList.add('hide-element');
//   // 가로 아이콘바 보이기
//   document.querySelector('.mob-icons').classList.remove('hide-element');


//   chatContainer.style.transition = '0.3s';
//   chatSection.style.transition = '0.3s';
//   middleSection.style.transition = '0.3s';

//   // middle 닫기
//   // middleSection.classList.add('hide-element');
//   middleSection.style.width = '0';
//   middleChannelSpan.classList.add('hide-element');
//   middleChannelIcon.classList.add('hide-element');
//   middleSearchBox.classList.add('hide-element');
//   searchIcon.classList.add('hide-element');
//   middleContent.classList.add('hide-element');
//   try {
//     createRoom.classList.add('hide-element');
//   } catch {
//     console.log('not found');
//   }

//   chatContainer.style.width = 'calc(100%)';
//   chatSection.style.width = 'calc(100%)';

//   const boardContainer = document.querySelector(".board-container");
//   const boardHeader = boardContainer.querySelector(".board-header");
//   const boardContents = boardContainer.querySelector(".board").childNodes;
//   const boardInputContainer = boardContainer.querySelector(".post-input-container");
//   const boardOpenButton = document.getElementById("boardOpen");
//   chatContainer.style.transition = '0.3s';
//   boardContainer.style.transition = '0.3s';

//   // 보드 접음
//   boardContainer.style.width = '3rem';
//   boardHeader.innerText = '';
//   for (let i = 0; i < boardContents.length; i++) {
//     if (boardContents[i].nodeName.toLowerCase() == 'div') {
//       boardContents[i].style.display = 'none';
//     };
//   };
//   boardInputContainer.style.display = 'none';
//   boardOpenButton.style.visibility = "visible"

//   const mobCloseOpenButton = document.querySelector('.mob-menu-icon');

//   // 클릭 리스너 등록
//   mobCloseOpenButton.onclick = () => {
//     if (mobCloseOpenButton.classList.contains('ri-close-fill')) {
//       // 닫기 시도 중
//       middleSection.style.width = '0';
//       middleChannelSpan.classList.add('hide-element');
//       middleChannelIcon.classList.add('hide-element');
//       middleSearchBox.classList.add('hide-element');
//       searchIcon.classList.add('hide-element');
//       middleContent.classList.add('hide-element');
//       try {
//         createRoom.classList.add('hide-element');
//       } catch {
//         console.log('not found!!');
//       }

//       chatContainer.classList.remove('hide-element');
//       chatSection.classList.remove('hide-element');
//       chatContainer.style.width = '100%';
//       chatSection.style.width = '100%';
//       document.querySelector('.chat-conversation-container').classList.remove('hidden-element');

//       mobCloseOpenButton.classList.remove('ri-close-fill');
//       mobCloseOpenButton.classList.add('ri-menu-2-line');
//     } else {
//       // 채팅방 가림
//       chatContainer.classList.add('hide-element');
//       chatSection.classList.add('hide-element');
//       document.querySelector('.chat-conversation-container').classList.add('hidden-element');

//       // 보드 접음
//       boardContainer.style.width = '3rem';
//       boardHeader.innerText = '';
//       for (let i = 0; i < boardContents.length; i++) {
//         if (boardContents[i].nodeName.toLowerCase() == 'div') {
//           boardContents[i].classList.add('hide-element');
//         };
//       };
//       boardInputContainer.classList.remove('hide-element');
//       boardOpenButton.style.visibility = "visible"

//       middleSection.style.width = '100%';
//       middleChannelSpan.classList.remove('hide-element');
//       middleChannelIcon.classList.remove('hide-element');
//       middleSearchBox.classList.remove('hide-element');
//       searchIcon.classList.remove('hide-element');
//       middleContent.classList.remove('hide-element');
//       try {
//         createRoom.classList.remove('hide-element');
//       } catch {
//         console.log('not found!!!!!!');
//       }

//       mobCloseOpenButton.classList.add('ri-close-fill');
//       mobCloseOpenButton.classList.remove('ri-menu-2-line');
//     }
//   }
// }