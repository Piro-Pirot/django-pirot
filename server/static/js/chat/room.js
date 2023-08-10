const chatSearchButton = document.getElementById("chat-search-btn");
const chatSearchInput = document.getElementById("chat-name-search");


chatSearchButton.addEventListener("click", () => {
  chatSearchInput.classList.toggle("active");
  chatSearchInput.focus();
});