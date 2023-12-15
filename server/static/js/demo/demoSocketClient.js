// 서버와 Socket 연결 설정
const socket = io();

// 연결 성공 시 이벤트 리스너
socket.on('connect', async () => {
    console.log('connect to server');
    await socket.emit('join', { 'name': 'hello' });
});

let bScroll = 0;

socket.on('display_message', async (data) => {
    console.log(data);
    data = JSON.parse(data);
    console.log(data);
    let offsetH = 0;
    if (data['year'] == lastYear && data['month'] == lastMonth && data['day'] == lastDate && data['hour'] == lastHour && data['min'] == lastMin && data['name'] == lastSender) {
        // 마지막 말풍선과 시간이 같고 보낸 사람이 같고 마지막 말풍선이 CHAT일 때 마지막 말풍선의 시간을 지움
        offsetH = await displayMessage(data, false);
    } else {
        offsetH = await displayMessage(data, true);
    }
    lastHour = data['hour'];
    lastMin = data['min'];
    lastSender = data['name'];

    lastYear = data['year'];
    lastMonth = data['month'];
    lastDate = data['day'];
    console.log('offsetH is ...', offsetH);
    // console.log('conv height is...', conversationSection.scrollHeight);
    // console.log('conv top is...', conversationSection.scrollTop);
    // console.log('conv now is...', curScroll);
    // console.log('calcScroll is...', calcScroll());
    // console.log('bScroll is...', bScroll);
    // 스크롤을 너무 많이 올린 게 아니라면 맨 아래로
    if (bScroll - 700 <= offsetH) {
        console.log('controlling!');
        controlScroll();
    }
});

// require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.23.0/min/vs' } });
// require(['vs/editor/editor.main'], function () {
//     editor = monaco.editor.create(document.getElementById('editor-container'), {
//         value: "",
//         language: "javascript"
//     });
// })

function onClickSendMessage() {
    // 서버로 메시지 전송
    const codeInput = document.querySelector(".code-input");

    if (codeInput.classList.contains("active")) {
        var codeSnippet = editor.getValue();
        // codeSnippet = `\`\`\`${codeSnippet}\`\`\``;

        if (codeSnippet.replace(/\n|\r|\s*/g, '') === '') return;

        socket.emit('sendCodeSnippet', { 'code': codeSnippet, 'name': NAME });
        editor.setValue("");

        controlScroll();
    } else {
        const msgBox = document.querySelector(".input");
        let msg = msgBox.value;

        console.log(msg);
        // 아무것도 안 썼을 때 예외 처리
        // 개행문자 모두 제거
        if (msg.replace(/\n|\r|\s*/g, '') === '') return;
        console.log(msg);

        msgBox.focus();

        controlScroll();

        socket.emit('send_message', { 'msg': msg, 'file': '', 'name': NAME, 'r': R, 'g': G, 'b': B });

        document.querySelector('.input').value = null;
    }

    console.log('send successfully');
}

// 말풍선 표시
async function displayMessage(bubbleData, newTimeFlag) {
    console.log(bubbleData);
    // 내가 방금 보낸 말풍선 표시

    let bubbleDiv = document.createElement('div');
    let bubbleContainer = document.createElement('div');

    // 1분이 지나지 않았다면 직전 말풍선의 시간을 제거
    if (!newTimeFlag && lastSender === bubbleData['name']) {
        try {
            // 마지막에서 두 번째 요소를 가져옴 (페이지 리로딩 시 처음 쌓은 말풍선)
            let lastTimeTag = document.querySelector('.conversation').childNodes;
            lastTimeTag = lastTimeTag[lastTimeTag.length - 1];
            lastTimeTag.lastElementChild.querySelector('.bubble-time').remove();
        } catch {
            console.log('first message');
        }
    } else {
        bubbleDiv.style.marginTop = '1rem';
    }

    if (bubbleData['name'] === NAME) {
        // 로그인 사용자의 말풍선인 경우
        bubbleDiv.classList.add('bubble-box-me');
        bubbleContainer.classList.add('bubble-container-me');
    } else {
        bubbleDiv.classList.add('bubble-box');
        bubbleContainer.classList.add('bubble-container');
    }

    // 사진, 이름
    let bubbleHeader = document.createElement('div');
    bubbleHeader.classList.add('bubble-header');

    let profileImgContainer = document.createElement('div');
    profileImgContainer.classList.add('bubble-profile-img');

    let profileImg = document.createElement('div');
    profileImg.style.backgroundColor = 'rgb(' + R + ',' + G + ',' + B + ')';

    let nameLabel = document.createElement('label');
    nameLabel.innerText = bubbleData['name'];
    nameLabel.classList.add('bubble-username');

    // 1분이 지났고 내 채팅이 아닐 때 사진 이름 표시
    if (newTimeFlag && bubbleData['name'] !== NAME) {
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

    const loadFile = (fileUrl) => {
        const myImage = new Image();
        myImage.src = fileUrl;
        return new Promise((resolve) => {
            myImage.onload = () => resolve(myImage)
            console.log('here');
        })
    }

    const loadingFile = async (fileUrl) => {
        await loadFile(fileUrl);
    }

    console.log(bubbleData['file']);
    let bubbleFileContent = '';
    if (!!bubbleData['file']) {
        bubbleFileContent = document.createElement('img');
        await bubbleFileContent.setAttribute('src', bubbleData['file']);
        await bubbleFileContent.classList.add('bubble-content');

        bubbleFileContent.style.cursor = 'pointer';
        await bubbleFileContent.addEventListener('click', () => {
            open(bubbleData['file'], '_blank');
        });
        await loadingFile(bubbleData['file']);
    }

    let bubbleTime = document.createElement('label');
    bubbleTime.classList.add('bubble-time');
    bubbleTime.innerText = `${bubbleData['hour']}:${bubbleData['min']}`;

    // 남의 채팅일 때
    if (bubbleData['name'] !== NAME) {
        if (!!bubbleData['file']) {
            bubbleContentContainer.appendChild(bubbleFileContent);
        } else {
            bubbleContentContainer.appendChild(bubbleContent);
        }
        bubbleContentContainer.appendChild(bubbleTime);
    } else {
        //나의 말풍선일 때
        bubbleContentContainer.appendChild(bubbleTime);
        if (!!bubbleData['file']) {
            bubbleContentContainer.appendChild(bubbleFileContent);
        } else {
            bubbleContentContainer.appendChild(bubbleContent);
        }
    }

    bubbleContainer.appendChild(bubbleContentContainer);

    bubbleDiv.appendChild(bubbleContainer);


    curScroll = conversationSection.scrollTop;

    // 화면에 추가
    conversations.appendChild(bubbleDiv);

    return bubbleDiv.offsetHeight;
}


// -------------------- 게시판 -----------------------


// post 게시 이벤트 : 이벤트 명을 받고 콜백 함수를 실행
socket.on('display_post', async (data) => {
    console.log(data);
    displayPost(data);
});

// 서버로 게시글 전송 id = room.id
function onClickSendPost() {
    const postInput = document.querySelector('.post').value;

    // 아무것도 안 썼을 때 예외 처리
    if (postInput === '') return;
    console.log(postInput);

    socket.emit('send_post', { 'postInput': postInput, 'name': NAME });
    console.log('send successfully');
}

// 게시글 표시
function displayPost(postData) {
    console.log(postData);
    // data로 받아옴!! data['newpostId'], ~ new post의 id, created_at 필요

    let postContainer = document.createElement('div');
    let postDiv = document.createElement('div');
    let postBox = document.createElement('div'); //석류가 추가한 코드
    let buttonDiv = document.createElement('div');

    // 로그인 사용자가 작성한 게시글인 경우
    if (postData['name'] == NAME) {
        let happyBtn = document.createElement('button');
        happyBtn.classList.add('happy');
        let happyImg = document.createElement('i');
        happyImg.classList.add('ri-emotion-happy-line');
        let happyCount = document.createElement('span');
        happyCount.innerText = postData['happyCount'];
        happyCount.classList.add(`happy-count-${postData['newpostId']}`);
        happyBtn.appendChild(happyImg);
        happyBtn.appendChild(happyCount);
        happyBtn.onclick = function () {
            onClickHappy(postData['newpostId']);
        };
        buttonDiv.appendChild(happyBtn); // 기뻐요

        let sadBtn = document.createElement('button');
        sadBtn.classList.add('sad');
        let sadImg = document.createElement('i');
        sadImg.classList.add('ri-emotion-sad-line');
        let sadCount = document.createElement('span');
        sadCount.innerText = postData['sadCount'];
        sadCount.classList.add(`sad-count-${postData['newpostId']}`);
        sadBtn.appendChild(sadImg);
        sadBtn.appendChild(sadCount);
        sadBtn.onclick = function () {
            onClickSad(postData['newpostId']); //여기 좋아요를 누르는 유저가 들어가야함
        };
        buttonDiv.appendChild(sadBtn); // 슬퍼요

        let deleteBtn = document.createElement('button');
        let deleteIcon = document.createElement('i');
        deleteBtn.classList.add('delete');
        deleteIcon.classList.add('ri-close-line');
        deleteBtn.appendChild(deleteIcon);
        deleteBtn.onclick = function () {
            onClickDelete(postData['newpostId']);
        };
        buttonDiv.appendChild(deleteBtn); // 삭제 버튼

        postDiv.classList.add('post-box');
    } else {
        let happyBtn = document.createElement('button');
        happyBtn.classList.add('happy');
        let happyImg = document.createElement('i');
        happyImg.classList.add('ri-emotion-happy-line');
        let happyCount = document.createElement('span');
        happyCount.innerText = postData['happyCount'];
        happyCount.classList.add(`happy-count-${postData['newpostId']}`);
        happyBtn.appendChild(happyImg);
        happyBtn.appendChild(happyCount);
        happyBtn.onclick = function () {
            onClickHappy(postData['newpostId']);
        };
        buttonDiv.appendChild(happyBtn); // 기뻐요

        let sadBtn = document.createElement('button');
        sadBtn.classList.add('sad');
        let sadImg = document.createElement('i');
        sadImg.classList.add('ri-emotion-sad-line');
        let sadCount = document.createElement('span');
        sadCount.innerText = postData['sadCount'];
        sadCount.classList.add(`sad-count-${postData['newpostId']}`);
        sadBtn.appendChild(sadImg);
        sadBtn.appendChild(sadCount);
        sadBtn.onclick = function () {
            onClickSad(postData['newpostId']);
        };
        buttonDiv.appendChild(sadBtn); // 슬퍼요
    }

    // 작성일
    let postTime = document.createElement('div');
    postTime.classList.add('post-time');
    postTime.innerText = postData['created_at']

    // 내용
    let postContent = document.createElement('div');
    postContent.classList.add('post-content');
    postContent.innerText = postData['postInput'];
    postDiv.appendChild(postContent);
    postBox.appendChild(postDiv); // 석류가 추가한 코드
    postBox.appendChild(buttonDiv);

    postContainer.appendChild(postTime);
    postContainer.appendChild(postBox);

    postContainer.classList.add('post-container');
    postContainer.classList.add(`post-container-${postData['newpostId']}`);
    // 화면에 추가
    posts.appendChild(postContainer);

    document.querySelector('.post').value = '';

    controlScrollboard()
}


socket.on('display_happy', async (data) => {
    console.log(data);
    displayHappy(data);
});

socket.on('display_sad', async (data) => {
    console.log(data);
    displaySad(data);
});


// Happy click -> id는 post id
function onClickHappy(post_id) {

    socket.emit('send_happy', { post_id});
    // console.log(curUsername)
    console.log('send successfully');
    displayMyHappy(post_id);
}

// Sad click -> id는 post id
function onClickSad(post_id) {

    socket.emit('send_sad', { post_id });
    console.log('send successfully');
    displayMySad(post_id);
}

// 여기 post 정보 : created_at "2023-08-10", newpostId, postInput, roomId, user

async function displayHappy(happyData) {
    console.log(happyData);
    let postId = happyData['post_id'];

    let happySelector = `.happy-count-${postId}`
    let happyCountElement = document.querySelector(happySelector);
    happyCountElement.innerText = happyData['happyCount'];
}

async function displaySad(sadData) {
    console.log(sadData);
    let postId = sadData['post_id'];

    let sadSelector = `.sad-count-${postId}`
    let sadCountElement = document.querySelector(sadSelector);
    sadCountElement.innerText = sadData['sadCount'];

}


// id = newPostId
function onClickDelete(post_id) {
    socket.emit('send_delete', { post_id })
    console.log('send_successfully')
}

socket.on('deleted_post', async (data) => {
    deletedPost(data);
});

async function deletedPost(deletedData) {
    let postId = deletedData['post_id']

    let delSelector = `.post-container-${postId}`;
    let delPostContainer = document.querySelector(delSelector);
    delPostContainer.remove()
}
