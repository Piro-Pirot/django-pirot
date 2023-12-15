const loadPosts = async () => {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    const url = '/demo/load_posts_ajax/';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({})
    });

    if (res.ok) {
        let { result: ajaxPosts } = await res.json();
        ajaxPosts = JSON.parse(ajaxPosts);

        loadPostsResponse(ajaxPosts);
    }
}

const loadPostsResponse = (ajaxPosts) => {
    ajaxPosts.forEach(element => createPost(element));
}


// 게시글을 만드는 코드
function createPost(postData) {
    console.log(postData);
    let postId = postData['id']
    let postUser = postData['name']

    let postContainer = document.createElement('div');
    let postBox = document.createElement('div'); //석류가 추가한 코드
    let postDiv = document.createElement('div');
    let buttonDiv = document.createElement('div')

    // 로그인 사용자가 작성한 게시글인 경우
    if (postUser == NAME) {
        let happyBtn = document.createElement('button');
        happyBtn.classList.add('happy');
        let happyImg = document.createElement('i');
        happyImg.classList.add('ri-emotion-happy-line');
        let happyCount = document.createElement('span');
        happyCount.innerText = postData['like'];
        happyCount.classList.add(`happy-count-${postId}`);
        happyBtn.appendChild(happyImg);
        happyBtn.appendChild(happyCount);
        happyBtn.onclick = function () {
            onClickHappy(postId);
        };
        buttonDiv.appendChild(happyBtn); // 기뻐요

        let sadBtn = document.createElement('button');
        sadBtn.classList.add('sad');
        let sadImg = document.createElement('i');
        sadImg.classList.add('ri-emotion-sad-line');
        let sadCount = document.createElement('span');
        sadCount.innerText = postData['sad'];
        sadCount.classList.add(`sad-count-${postId}`);
        sadBtn.appendChild(sadImg);
        sadBtn.appendChild(sadCount);
        sadBtn.onclick = function () {
            onClickSad(postId);
        };
        buttonDiv.appendChild(sadBtn); // 슬퍼요

        let deleteBtn = document.createElement('button');
        let deleteIcon = document.createElement('i');
        deleteBtn.classList.add('delete');
        deleteIcon.classList.add('ri-close-line');
        deleteBtn.appendChild(deleteIcon);
        deleteBtn.onclick = function () {
            onClickDelete(postId);
        };
        buttonDiv.appendChild(deleteBtn); // 삭제 버튼

        postDiv.classList.add('post-box');
        postContainer.classList.add('post-container');
    } else {
        let happyBtn = document.createElement('button');
        happyBtn.classList.add('happy');
        let happyImg = document.createElement('i');
        happyImg.classList.add('ri-emotion-happy-line');
        let happyCount = document.createElement('span');
        happyCount.innerText = postData['like'];
        happyCount.classList.add(`happy-count-${postId}`);
        happyBtn.appendChild(happyImg);
        happyBtn.appendChild(happyCount);
        happyBtn.onclick = function () {
            onClickHappy(postId);
        };
        buttonDiv.appendChild(happyBtn);

        let sadBtn = document.createElement('button');
        sadBtn.classList.add('sad');
        let sadImg = document.createElement('i');
        sadImg.classList.add('ri-emotion-sad-line');
        let sadCount = document.createElement('span');
        sadCount.innerText = postData['sad'];
        sadCount.classList.add(`sad-count-${postId}`);
        sadBtn.appendChild(sadImg);
        sadBtn.appendChild(sadCount);
        sadBtn.onclick = function () {
            onClickSad(postId);
        };
        buttonDiv.appendChild(sadBtn);

        postDiv.classList.add('post-box');
        postContainer.classList.add('post-container');
    }

    // 작성일
    let postTime = document.createElement('div');
    postTime.classList.add('post-time');
    postTime.innerText = postData['created_at']

    // 내용
    let postContent = document.createElement('div');
    postContent.classList.add('post-content');
    postContent.innerText = postData['content'];
    postDiv.appendChild(postContent);
    postBox.appendChild(postDiv); // 석류가 추가한 코드
    postBox.appendChild(buttonDiv);

    postContainer.appendChild(postTime);
    postContainer.appendChild(postBox);

    postContainer.classList.add(`post-container-${postId}`);
    // 화면에 추가
    posts.appendChild(postContainer);

    document.querySelector('.post').value = '';

    controlScrollboard()
}

// 기뻐요, 슬퍼요 만드는 코드

function createHappy(happyData) {
    console.log(happyData);
    let postId = happyData['postId'];

    let happySelector = `.happy-count-${postId}`
    let happyCountElement = document.querySelector(happySelector);
    happyCountElement.innerText = happyData['happyCount'];

    let sadSelector = `.sad-count-${postId}`
    let sadCountElement = document.querySelector(sadSelector);
    sadCountElement.innerText = happyData['sadCount'];
}

function createSad(sadData) {
    console.log(sadData);
    let postId = sadData['postId'];

    let happySelector = `.happy-count-${postId}`
    let happyCountElement = document.querySelector(happySelector);
    happyCountElement.innerText = sadData['happyCount'];

    let sadSelector = `.sad-count-${postId}`
    let sadCountElement = document.querySelector(sadSelector);
    sadCountElement.innerText = sadData['sadCount'];
}

/* 전송 시 스크롤 제어 */
boardSection = document.querySelector('.board');

function controlScrollboard() {
    boardSection.scrollTop = boardSection.scrollHeight;
}

// 여기 정보 : {id: 55, content: '됏스', room: 10, created_at: '2023-08-10', user__username: 'minseo'}


// 게시판 창 열고 닫기
// if (matchMedia("(min-width: 768px)").matches) {
const boardCloseButton = document.getElementById("widthControl");
const chatContainer = document.querySelector(".chat-conversation-container");
const boardContainer = document.querySelector(".board-container");

const boardHeader = boardContainer.querySelector(".board-header");
const boardContents = boardContainer.querySelector(".board").childNodes;
const boardInput = boardContainer.querySelector(".post-input")
const boardInputContainer = boardContainer.querySelector(".post-input-container");
const boardOpenButton = document.getElementById("boardOpen");

const btnSendIcon = document.querySelector('.ri-send-plane-fill');

chatContainer.style.transition = '0.3s';
boardContainer.style.transition = '0.3s';

boardCloseButton.onclick = boardClose;
function boardClose() {
    boardContainer.style.width = '3rem';
    chatContainer.style.width = 'calc(100% - 3rem)';
    boardHeader.innerText = '';
    for (let i = 0; i < boardContents.length; i++) {
        if (boardContents[i].nodeName.toLowerCase() == 'div') {
            boardContents[i].style.display = 'none';
        };
    };
    boardInputContainer.style.display = 'none';
    boardOpenButton.style.visibility = "visible";
    btnSendIcon.style.visibility = 'visible';
}

boardOpenButton.onclick = boardOpen;
function boardOpen() {
    boardContainer.style.width = '18rem';
    chatContainer.style.width = 'calc(100% - 18rem)';
    boardHeader.innerText = 'Board';
    for (let i = 0; i < boardContents.length; i++) {
        if (boardContents[i].nodeName.toLowerCase() == 'div') {
            boardContents[i].style.display = 'block';
        };
    };
    boardInputContainer.style.display = 'block';
    boardOpenButton.style.visibility = "hidden";
    btnSendIcon.style.visibility = 'hidden';
};

if (window.innerWidth <= 1000) {
    boardClose();
}

//창 줄여졌을 때 게시판 자동으로 닫히기
window.addEventListener("resize", () => {
    if (window.innerWidth <= 1000) {
        boardClose();
    }
    else {
        boardOpen();
    };
});

//페이지 리로드 됐을 떄 창 크기가 1000px 이하면 접혀있는 상태 유지
// window.onload = () => {
//     if (window.innerWidth <= 1000) {
//         boardClose();
//     }
//     else {
//         boardOpen();
//     };
// };



// if (matchMedia("(max-width: 768px)").matches) {
//     const boardCloseButton = document.getElementById("widthControl");
//     const chatContainer = document.querySelector(".chat-conversation-container");
//     const boardContainer = document.querySelector(".board-container");

//     const boardHeader = boardContainer.querySelector(".board-header");
//     const boardContents = boardContainer.querySelector(".board").childNodes;
//     const boardInput = boardContainer.querySelector(".post-input")
//     const boardInputContainer = boardContainer.querySelector(".post-input-container");
//     const boardOpenButton = document.getElementById("boardOpen");

//     chatContainer.style.transition = '0.3s';
//     boardContainer.style.transition = '0.3s';

//     function boardClose() {
//         boardContainer.style.width = '3rem';
//         chatContainer.style.width = '100%';
//         boardHeader.innerText = '';
//         document.querySelector('.btn-send').innerText = 'SEND';
//         for (let i = 0; i < boardContents.length; i++) {
//             if (boardContents[i].nodeName.toLowerCase() == 'div') {
//                 boardContents[i].style.display = 'none';
//             };
//         };
//         boardInputContainer.style.display = 'none';
//         boardOpenButton.style.visibility = "visible";
//     };
//     boardCloseButton.onclick = boardClose;
//     function boardOpen() {
//         boardContainer.style.width = '40%';
//         chatContainer.style.width = '60%';
//         boardHeader.innerText = 'Board';
//         document.querySelector('.btn-send').innerText = '';
//         for (let i = 0; i < boardContents.length; i++) {
//             if (boardContents[i].nodeName.toLowerCase() == 'div') {
//                 boardContents[i].style.display = 'block';
//             };
//         };
//         boardInputContainer.style.display = 'block';
//         boardOpenButton.style.visibility = "hidden";
//     };
//     boardOpenButton.onclick = boardOpen;
// }