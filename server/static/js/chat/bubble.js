let cookie = document.cookie;
let csrfToken = cookie.substring(cookie.indexOf('=') + 1);

/* 전송 시 스크롤 제어 */
conversationSection = document.querySelector('.conversation');

function controlScroll() {
    conversationSection.scrollTop = conversationSection.scrollHeight;
}

function calcScroll() {
    // 전체 스크롤 크기 == 내 현재 위치이면 맨 아래에 위치
    return conversationSection.scrollHeight - curScroll;
}

// 현재 스크롤 위치
let curScroll = conversationSection.scrollTop;
conversationSection.addEventListener('scroll', () => {
    curScroll = conversationSection.scrollTop;
    console.log(calcScroll());
})

// 말풍선 데이터를 Ajax 방식으로 받아오기
// 장고 쿼리셋 -> json -> html -> 자바스크립트 딕셔너리 과정이 너무 복잡해서
const loadBubbles = async(roomId) => {
    const url = '/bubbles/load_bubbles_ajax/';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({roomId: roomId})
    });

    if (res.ok) {
        let {result: ajaxBubbles} = await res.json();
        ajaxBubbles = JSON.parse(ajaxBubbles);

        loadBubblesResponse(ajaxBubbles);

        // 처음에는 스크롤 맨 아래로
        controlScroll();
    }
}

const loadBubblesResponse = (ajaxBubbles) => {
    ajaxBubbles.forEach(element => createBubble(element));
}

loadBubbles(curRoomId);


// 엔터 전송
let inputBox = document.querySelector('.input');
inputBox.addEventListener('keydown', (event) => {
    if(event.keyCode==13 && (!event.shiftKey)) {
        event.preventDefault();
        document.querySelector('.btn-send').click();
    }
})

// 말풍선을 만드는 코드
function createBubble(bubbleData) {
    console.log(bubbleData);

    console.log(bubbleData['content']);
    let bubbleDiv = document.createElement('div');
    let bubbleContainer = document.createElement('div');

    if(bubbleData['user__username'] === curUsername) {
        // 로그인 사용자의 말풍선인 경우
        bubbleDiv.classList.add('bubble-box-me');
        bubbleContainer.classList.add('bubble-container-me');
    }
    else {
        bubbleDiv.classList.add('bubble-box');
        bubbleContainer.classList.add('bubble-container');
    }

    // 사진, 이름
    let bubbleHeader = document.createElement('div');
    bubbleHeader.classList.add('bubble-header');

    let profileImg = document.createElement('img');
    profileImg.setAttribute('src', bubbleData['profile_img']);

    let nameLabel = document.createElement('label');
    if(curRoomType == 1) {
        // 익명 질문 방이면
        nameLabel.innerText = bubbleData['nickname'];
    } else {
        nameLabel.innerText = bubbleData['user__username'];
    }
    nameLabel.classList.add('bubble-username');

    bubbleHeader.appendChild(profileImg);
    bubbleHeader.appendChild(nameLabel);

    // 내용
    let bubbleContent = document.createElement('div');
    bubbleContent.classList.add('bubble-content');
    bubbleContent.innerHTML = bubbleData['content'];

    bubbleContainer.appendChild(bubbleHeader);
    bubbleContainer.appendChild(bubbleContent);

    bubbleDiv.appendChild(bubbleContainer);

    // 화면에 추가
    conversations.appendChild(bubbleDiv);
}