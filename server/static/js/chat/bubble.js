let cookie = document.cookie;
let csrfToken = cookie.substring(cookie.indexOf('=') + 1);

/* 전송 시 스크롤 제어 */
conversationSection = document.querySelector('.conversation');

function controlScroll() {
    conversationSection.scrollTop = conversationSection.scrollHeight;
}

function calcScroll() {
    // 전체 스크롤 크기 == 내 현재 위치이면 맨 아래에 위치
    return conversationSection.scrollHeight - conversationSection.scrollTop;
}

// 현재 스크롤 위치
conversationSection.addEventListener('scroll', () => {
    bScroll = calcScroll();
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

        if(ajaxBubbles !== null) {
            ajaxBubbles = JSON.parse(ajaxBubbles);
            loadBubblesResponse(ajaxBubbles);
        }

        // 처음에는 스크롤 맨 아래로
        controlScroll();
    }
}


// 마지막 말풍선의 시간, 분 보낸 사람 정보를 저장
let lastHour = 0;
let lastMin = 0;
let lastSender = '';

const loadBubblesResponse = (ajaxBubbles) => {
    let timeFlag = true;
    for(let i = 0; i < ajaxBubbles.length - 1; i++) {
        // 시간을 표시할 건지
        timeFlag = true;

        const thisBubble = ajaxBubbles[i];
        const nextBubble = ajaxBubbles[i+1];

        if(thisBubble['hour'] == nextBubble['hour']
        && thisBubble['min'] == nextBubble['min']
        && thisBubble['user__name'] == nextBubble['user__name']) {
            // 1분이 지나기 전에 보낸 말풍선은 시간 표시하지 않음
            timeFlag = false;
        }
        createBubble(ajaxBubbles[i], timeFlag);
    }
    // 마지막 말풍선은 항상 표시
    const lastBubble = ajaxBubbles[ajaxBubbles.length - 1];
    createBubble(lastBubble, true);
    
    lastHour = lastBubble['hour'];
    lastMin = lastBubble['min'];
    lastSender = lastBubble['user__name'];
}

loadBubbles(curRoomId);


// 엔터 전송
let inputBox = document.querySelector('.input');
inputBox.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && event.shiftKey) {
        event.preventDefault();
        console.log("insertLineBreak");
        const txtArea = document.querySelector('.input');
        txtArea.value += '\r\n';
    }
    if (event.key == 'Enter' && !event.shiftKey) {
        event.preventDefault();
        document.querySelector('.btn-send').click();
    }
})


// 말풍선을 만드는 코드
function createBubble(bubbleData, timeFlag) {
    console.log(bubbleData);

    console.log(bubbleData['content']);
    let bubbleDiv = document.createElement('div');
    let bubbleContainer = document.createElement('div');

    if(bubbleData['user__name'] === curUserRealName) {
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
        nameLabel.innerText = bubbleData['user__name'];
    }
    nameLabel.classList.add('bubble-username');

    // 현재 시간을 표기해야 하고, 로그인 사용자가 아니라면 사진과 이름 표시
    if (timeFlag && bubbleData['user__name'] !== curUserRealName) {
        bubbleHeader.appendChild(profileImg);
        bubbleHeader.appendChild(nameLabel);
        bubbleContainer.appendChild(bubbleHeader);
    }

    // 내용과 시간을 담는 div
    let bubbleContentContainer = document.createElement('div');
    bubbleContentContainer.classList.add('bubble-content-container');

    // 내용
    let bubbleContent = document.createElement('div');
    bubbleContent.classList.add('bubble-content');
    bubbleContent.innerHTML = bubbleData['content'];

    // 작성 시간
    if(timeFlag) {
        bubbleDiv.style.marginTop = '1rem';
        let bubbleTime = document.createElement('label');
        bubbleTime.classList.add('bubble-time');
        bubbleTime.innerText = `${bubbleData['hour']}:${bubbleData['min']}`;

        if(bubbleData['user__name'] === curUserRealName) {
            //나의 말풍선일 때
            bubbleContentContainer.appendChild(bubbleTime);
            bubbleContentContainer.appendChild(bubbleContent);
        } else {
            bubbleContentContainer.appendChild(bubbleContent);
            bubbleContentContainer.appendChild(bubbleTime);
        }
    } else {
        bubbleContentContainer.appendChild(bubbleContent);
    }

    bubbleContainer.appendChild(bubbleContentContainer);

    bubbleDiv.appendChild(bubbleContainer);

    // 화면에 추가
    conversations.appendChild(bubbleDiv);
}