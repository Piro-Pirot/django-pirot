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

//체크박스 하나 눌려있는 상태에서 다른 체크박스 누르면 기존에 눌려있던 것은 해제
const lightModeCheckbox = document.getElementById("lightMode");
const darkModeCheckbox = document.getElementById("darkMode");
const lightModeDiv = document.querySelector(".checkbox-wrapper-13:first-child");
const darkModeDiv = document.querySelector(".checkbox-wrapper-13:last-child");

lightModeCheckbox.addEventListener("change", () => {
  if (darkModeCheckbox.checked) {
    darkModeCheckbox.checked = false;
  };
});
darkModeCheckbox.addEventListener("change", () => {
  if (lightModeCheckbox.checked) {
    lightModeCheckbox.checked = false;
  };
});

