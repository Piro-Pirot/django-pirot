const roomAddModal= document.querySelector(".room-add-modal");
const roomCreateButton = document.querySelector(".btn-room-create");


// 모달 열기 
roomAddModal.style.opacity = '0';
roomCreateButton.addEventListener("click", () => {
  roomAddModal.showModal();
  roomAddModal.style.opacity = "1";
});

// 모달 닫기
const roomModalCloseButton = document.querySelector(".room-add-modal #close-btn");
roomModalCloseButton.addEventListener("click", () => {
  if(roomAddModal.open) {
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
const inviteButton = document.querySelector(".room-add-invite input[type=button]");
const inviteContent = document.querySelector(".room-add-invite");
const roomNameContent = document.querySelector(".room-add-name");
const addRoomButton = document.querySelector(".room-add-name input[type=button]");

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
