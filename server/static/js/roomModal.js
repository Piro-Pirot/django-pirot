const roomAddModal= document.querySelector(".room-add-modal");
const roomCreateButton = document.querySelector(".btn-room-create");
const settingsButton = document.querySelector("#settings");
const settingsModal = document.querySelector(".settings-modal");


// 모달 열기 
roomAddModal.style.opacity = '0';
roomCreateButton.addEventListener("click", () => {
  roomAddModal.showModal();
  roomAddModal.style.opacity = "1";
});

settingsModal.style.opacity = '0';
settingsButton.style.cursor = 'pointer';
settingsButton.addEventListener("click", () => {
  settingsModal.showModal();
  settingsModal.style.opacity = '1';
});

// 모달 닫기
const roomModalCloseButton = document.querySelector(".room-add-invite #close-btn");
roomModalCloseButton.addEventListener("click", () => {
  if(roomAddModal.open) {
    roomAddModal.close();
    roomAddModal.style.opacity = '0';
  }
});

const settingsModalCloseButton = document.querySelector(".settings-modal #close-btn");
settingsModalCloseButton.addEventListener("click", () => {
  if(settingsModal.open) {
    settingsModal.close();
    settingsModal.style.opacity = '0';
  }
});

//Esc 누르면 모달 opacity 초기화
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    roomAddModal.style.opacity = '0';
    settingsModal.style.opacity = '0';
  }
});