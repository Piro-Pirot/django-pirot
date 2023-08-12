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