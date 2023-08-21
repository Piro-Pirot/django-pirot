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



//middle section 검색창 구현
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








// let searchButton = document.getElementById("search-btn");
// let channelName = document.getElementById("channel-name");
// let searchInput = document.getElementById("search-input");

// searchInput.style.visibility = "hidden";
// searchInput.style.opacity = "0";

// searchButton.onclick = () => {
//   if (searchInput.style.visibility === "hidden") {
//     channelName.style.visibility = "hidden";
//     channelName.style.opacity = "0";
//     searchInput.style.visibility = "visible";
//     searchInput.style.opacity = "1";
//     searchInput.focus();
//   }
//   else if (searchInput.style.visibility === "visible") {
//     channelName.style.visibility = "visible";
//     channelName.style.opacity = "1";
//     searchInput.style.visibility = "hidden";
//     searchInput.style.opacity = "0";
//   }
// };

// let searchBox = document.getElementById("search");
// window.addEventListener("click", (event) => {
//   if (!searchBox.contains(event.target)) {
//     channelName.style.visibility = "visible";
//     channelName.style.opacity = "1";
//     searchInput.style.visibility = "hidden";
//     searchInput.style.opacity = "0"
//   };
// });


// /* select option 새로고침 되어도 유지 */



// //channel이름 selector 구현
// let selectedChannel = document.querySelector(".select-btn span");
// let selectButton = document.querySelector(".select-btn");
// let channelOptionsList = document.querySelector(".select-options");
// let channelOptions = document.querySelectorAll(".select-options li");


// channelOptions.forEach(option => {
//   option.addEventListener("click", () => {
//     selectedChannel.innerHTML = option.innerHTML;
//     channelOptionsList.classList.toggle("active");
//     window.open(`/room/${option.id}/main`, '_self');
//   });
//   if (option.id == curChannelId) {
//     selectedChannel.innerText = option.innerText;
//   }
// });

// selectButton.addEventListener("click", () => {
//   channelOptionsList.classList.toggle("active");
//   selectButton.classList.toggle("color-stay");
// });


// // 모바일 반응형
// // middle 열어두고 채팅과 보드를 완전 닫음
// if (matchMedia("screen and (max-width: 768px)").matches) {
//   const middleSection = document.querySelector(".middle-section");

//   // middle만 꽉차게
//   middleSection.style.width = '100%';

//   const chatContainer = document.querySelector(".chat-conversation-container");
//   const chatSection = document.querySelector('.chat-section');
//   const chatName = document.querySelector('.chat-name');
//   const chatConv = document.querySelector('.chat-conversation-container');
//   const conv = document.querySelector('.conversation');
//   const chatInput = document.querySelector('.chat-input');

//   chatContainer.style.transition = '0.3s';
//   chatSection.style.transition = '0.3s';
//   middleSection.style.transition = '0.3s';

//   // 채팅방 가림
//   chatContainer.style.width = '0';
//   chatSection.style.width = '0';
//   chatName.style.width = '0';
//   chatContainer.classList.add('hide-element');
//   chatSection.classList.add('hide-element');
//   chatName.classList.add('hide-element');
//   chatConv.classList.add('hide-element');
//   conv.classList.add('hide-element');
//   chatInput.classList.add('hide-element');

//   const board = document.querySelector('.board');
//   board.classList.add('hide-element');
// }