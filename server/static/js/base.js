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