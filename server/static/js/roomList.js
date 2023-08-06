const roomAddModal= document.querySelector(".room-add-modal");
const roomCreateButton = document.querySelector(".btn-room-create");

roomCreateButton.addEventListener("click", () => {
  roomAddModal.showModal();
})