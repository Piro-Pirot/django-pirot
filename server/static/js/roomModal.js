const roomAddModal= document.querySelector(".room-add-modal");
const roomCreateButton = document.querySelector(".btn-room-create");


// 모달 열기 
roomAddModal.style.opacity = '0';
roomCreateButton.addEventListener("click", () => {
  roomAddModal.showModal();
  roomAddModal.style.opacity = "1";
});

// 모달 닫기
const roomModalCloseButton = document.querySelector(".room-add-invite #close-btn");
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