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

/* select 태그에서 option을 가져와 class가 url의 channel id와 같을 때 selected 옵션을 줌 */
// let selectEl = document.querySelector('.select-options').getElementsByTagName('li span');

// for(let i = 0; i < selectEl.length; i++) {
//   if(selectEl[i].id === curChannelId) {
//     selectEl[i].setAttribute('selected', '')
//     break;
//   }
// }


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
