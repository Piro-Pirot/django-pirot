/* 전송 시 스크롤 제어 */
conversationSection = document.querySelector('.conversation');

function controlScroll() {
    conversationSection.scrollTop = conversationSection.scrollHeight;
}

function calcScroll() {
    // 전체 스크롤 크기 == 내 현재 위치이면 맨 아래에 위치
    return conversationSection.scrollHeight - conversationSection.scrollTop;
}

// 말풍선 데이터를 Ajax 방식으로 받아오기
// 장고 쿼리셋 -> json -> html -> 자바스크립트 딕셔너리 과정이 너무 복잡해서
const loadBubbles = async(roomId, page) => {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    const url = '/bubbles/load_bubbles_ajax/';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({roomId: roomId, page: page})
    });

    if(res.ok) {
        let {result: ajaxBubbles} = await res.json();

        if(ajaxBubbles !== null) {
            ajaxBubbles = JSON.parse(ajaxBubbles);
            loadBubblesResponse(ajaxBubbles);
        }

        // 처음에는 스크롤 맨 아래로
        if(page === 0) controlScroll();
    }
}


// 마지막 말풍선의 시간, 분 보낸 사람 정보를 저장
let lastHour = 0;
let lastMin = 0;
let lastSender = '';
let lastBubbleType = CHAT;

// 마지막 말풍선의 년, 월, 일 저장
let lastYear = 0;
let lastMonth = 0;
let lastDate = 0;

function isSameWithNext(thisBubble, nextBubble) {
    if((thisBubble['hour'] == nextBubble['hour']
    && thisBubble['min'] == nextBubble['min']
    && thisBubble['user__username'] == nextBubble['user__username'])) {
        // 다음 말풍선과 시간이 같고 보낸 사람이 같으면 시간과 프로필을 표시하지 않음
        return false;
    }
    return true;
}

function isSameWithPrev(prevBubble, thisBubble) {
    if(prevBubble['hour'] == thisBubble['hour']
    && prevBubble['min'] == thisBubble['min']
    && prevBubble['user__username'] == thisBubble['user__username']
    && prevBubble['is_notice'] == CHAT) {
        // 직전 말풍선과 시간이 같고 보낸 사람이 같고 직전 말풍선이 CHAT이라면 시간과 프로필을 표시하지 않음
        return false;
    }
    return true;
}

// 말풍선을 위에서 아래로 쌓았었는데 아래에서 위로 쌓아야 함.
const loadBubblesResponse = (ajaxBubbles) => {
    let timeFlag = true;
    // 첫 번째 말풍선은 프로필을 항상 표시
    const firstBubble = ajaxBubbles[0];
    try {
        const secondBubble = ajaxBubbles[1];
        createBubble(firstBubble, isSameWithNext(firstBubble, secondBubble), true);
    } catch {
        createBubble(firstBubble, true, true);
        console.log('hello');
    }
    lastHour = firstBubble['hour'];
    lastMin = firstBubble['min'];
    lastSender = firstBubble['user__username'];
    lastBubbleType = firstBubble['is_notice'];

    lastYear = firstBubble['year'];
    lastMonth = firstBubble['month'];
    lastDate = firstBubble['day'];
    
    for(let i = 1; i < ajaxBubbles.length - 1; i++) {
        const prevBubble = ajaxBubbles[i-1];
        const thisBubble = ajaxBubbles[i];
        const nextBubble = ajaxBubbles[i+1];

        createBubble(ajaxBubbles[i], isSameWithNext(thisBubble, nextBubble), isSameWithPrev(prevBubble, thisBubble));
    }
    // 마지막 말풍선은 시간을 항상 표시
    try {
        const secondLastBubble = ajaxBubbles[ajaxBubbles.length - 2];
        const lastBubble = ajaxBubbles[ajaxBubbles.length - 1];
        lastHour = lastBubble['hour'];
        lastMin = lastBubble['min'];
        lastSender = lastBubble['user__username'];
        lastBubbleType = lastBubble['is_notice'];

        lastYear = lastBubble['year'];
        lastMonth = lastBubble['month'];
        lastDate = lastBubble['day'];
        createBubble(lastBubble, true, isSameWithPrev(secondLastBubble, lastBubble));
    } catch {
        console.log('theres no next bubble');
    }
}

loadBubbles(curRoomId, 0);

// 현재 스크롤 위치
conversations.addEventListener('scroll', async () => {
    bScroll = calcScroll();
    if(conversations.scrollTop === 0) {
        const cntBubbles = conversations.childNodes.length;
        scrollStorage = conversations.scrollHeight;
        // 와.. await 걸어 주기!! Height 값이 함수 앞 뒤로 달라야 해요
        await loadBubbles(curRoomId, cntBubbles);
        conversations.scrollTop = conversations.scrollHeight - scrollStorage;
    }
})


// 엔터 전송
let inputBox = document.querySelector('.input');
inputBox.addEventListener('keypress', (event) => {
    if (event.key == 'Enter' && event.shiftKey) {
        event.preventDefault();
        console.log("insertLineBreak");
        const txtArea = document.querySelector('.input');
        txtArea.value += '\n';
    }
    if (event.key == 'Enter' && !event.shiftKey) {
        event.preventDefault();
        document.querySelector('.btn-send').click();
    }
})

// 말풍선을 만드는 코드
function createBubble(bubbleData, timeFlag, profileFlag) {
    console.log(bubbleData);

    console.log(bubbleData['content']);
    let bubbleDiv = document.createElement('div');
    let bubbleContainer = document.createElement('div');

    NOTICE = 1
    if(bubbleData['is_notice'] === NOTICE) {
        bubbleDiv.classList.add('bubble-notice');
        bubbleContainer.classList.add('bubble-notice-container');

        let bubbleNotice = document.createElement('div');
        bubbleNotice.classList.add('bubble-notice-content')
        bubbleNotice.innerHTML = bubbleData['content'];
        
        bubbleContainer.appendChild(bubbleNotice);
    } else {
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

        let profileImgContainer = document.createElement('div');
        profileImgContainer.classList.add('bubble-profile-img');

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

        // 사진을 표시해야 하면 모든 말풍선에 marginTop을 주기
        // if(profileFlag) {
        //     bubbleDiv.style.marginTop = '1rem';
        // }
        // 사진을 표시해야하고, 로그인 사용자가 아니라면 사진과 이름 표시
        if(profileFlag && bubbleData['user__username'] !== curUsername) {
            profileImgContainer.appendChild(profileImg);
            bubbleHeader.appendChild(profileImgContainer);
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

        // 파일을 첨부했다면
        console.log(bubbleData['file']);
        let bubbleFileContainer = '';
        let bubbleFileContent = '';
        if(!!bubbleData['file']) {
            bubbleFileContent = document.createElement('img');
            bubbleFileContent.setAttribute('src', bubbleData['file']);
            bubbleFileContent.classList.add('bubble-content');
            
            bubbleFileContent.style.cursor = 'pointer';
            bubbleFileContent.addEventListener('click', () => {
                open(bubbleData['file'], '_blank');
            });
        }

        // 작성 시간
        if(timeFlag) {
            let bubbleTime = document.createElement('label');
            bubbleTime.classList.add('bubble-time');
            bubbleTime.innerText = `${bubbleData['hour']}:${bubbleData['min']}`;

            if(bubbleData['user__username'] === curUsername) {
                //나의 말풍선일 때
                bubbleContentContainer.appendChild(bubbleTime);
                if(!!bubbleData['file']) {
                    bubbleContentContainer.appendChild(bubbleFileContent);
                } else {
                    bubbleContentContainer.appendChild(bubbleContent);
                }
            } else {
                if(!!bubbleData['file']) {
                    bubbleContentContainer.appendChild(bubbleFileContent);
                } else {
                    bubbleContentContainer.appendChild(bubbleContent);
                }
                bubbleContentContainer.appendChild(bubbleTime);
            }
        } else {
            bubbleContentContainer.appendChild(bubbleContent);
        }

        bubbleContainer.appendChild(bubbleContentContainer);

    }
    bubbleDiv.appendChild(bubbleContainer);

    // 화면에 추가
    conversations.insertBefore(bubbleDiv, conversations.firstChild);
}