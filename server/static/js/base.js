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





