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


/* select option 새로고침 되어도 유지 */

// URL에서 채널 이름 가져오기
const channelFromPath = decodeURI(location.pathname);

let channel_cnt = 0;
let channel_index = 0;
let channel_startPoint = 0;
let channel_endPoint = 0;
for(channel_index = 0; channel_index < channelFromPath.length; channel_index++) {
    if(channel_cnt === 2) {
      channel_startPoint = channel_index;
      break;
    }
    if(channelFromPath[channel_index] === '/') channel_cnt += 1;
}
channel_cnt = 0;
for(channel_index; channel_index < channelFromPath.length; channel_index++) {
  if(channel_cnt === 1) {
    channel_endPoint = channel_index;
    break;
  }
  if(channelFromPath[channel_index] === '/') channel_cnt += 1;
}
const channelNamefromUrl = channelFromPath.slice(channel_startPoint, channel_endPoint - 1);

/* select 태그에서 option을 가져와 innerText가 url의 channel name과 같을 때 selected 옵션을 줌 */
let selectEl = document.getElementById('select-channel').getElementsByTagName('option');

for(let i = 0; i < selectEl.length; i++) {
  if(selectEl[i].innerText === channelNamefromUrl) {
    selectEl[i].setAttribute('selected', '')
    break;
  }
}
