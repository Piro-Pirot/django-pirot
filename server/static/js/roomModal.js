const roomAddModal= document.querySelector(".room-add-modal");
const roomCreateButton = document.querySelector(".btn-room-create");
const settingsButton = document.querySelector("#settings");
const settingsModal = document.querySelector(".settings-modal");

roomAddModal.style.opacity = '0';
roomCreateButton.addEventListener("click", () => {
  roomAddModal.showModal();
  roomAddModal.style.opacity = "1";
});

settingsModal.style.opacity = '0';
settingsButton.addEventListener("click", () => {
  settingsModal.showModal();
  settingsModal.style.opacity = '1';
});


const roomModalCloseButton = document.querySelector(".room-add-invite #close-btn");
roomModalCloseButton.addEventListener("click", () => {
  if(roomAddModal.open) {
    roomAddModal.close();
    roomAddModal.style.opacity = '0';
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    roomAddModal.style.opacity = '0';
  }
});