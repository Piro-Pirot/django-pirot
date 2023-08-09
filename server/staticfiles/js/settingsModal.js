const settingsButton = document.querySelector("#settings");
const settingsModal = document.querySelector(".settings-modal");

settingsModal.style.opacity = '0';
settingsButton.style.cursor = 'pointer';
settingsButton.addEventListener("click", () => {
  settingsModal.showModal();
  settingsModal.style.opacity = '1';
});

const settingsModalCloseButton = document.querySelector(".settings-modal #close-btn");
settingsModalCloseButton.addEventListener("click", () => {
  if(settingsModal.open) {
    settingsModal.close();
    settingsModal.style.opacity = '0';
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    settingsModal.style.opacity = '0';
  }
});