const loadPosts = async(roomId) => {
    const url = '/posts/load_posts_ajax/';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({roomId: roomId})
    });

    if (res.ok) {
        let {result: ajaxPosts} = await res.json();
        ajaxPosts = JSON.parse(ajaxPosts);

        loadPostsResponse(ajaxPosts);
    }
}

const loadPostsResponse = (ajaxPosts) => {
    ajaxPosts.forEach(element => createPost(element));
}

loadPosts(curRoomId);


// 게시글을 만드는 코드
function createPost(postData) {
    console.log(postData);
    let postId = postData['id']
    let postUser = postData['user__username']
    let roomId = postData['room']
    
    let postContainer = document.createElement('div');
    let postDiv = document.createElement('div');
    let buttonDiv = document.createElement('div')
    
    // 로그인 사용자가 작성한 게시글인 경우
    if(postUser == curUsername) {
        let happyBtn = document.createElement('button');
        happyBtn.classList.add('happy');
        let happyImg = document.createElement('i');
        happyImg.classList.add('ri-emotion-happy-line');
        let happyCount = document.createElement('span');
        happyCount.innerText = postData['happyCount'];
        happyCount.classList.add(`happy-count-${postId}`);
        happyBtn.appendChild(happyImg);
        happyBtn.appendChild(happyCount);
        happyBtn.onclick = function() {
            onClickHappy(postId, roomId);
        };
        buttonDiv.appendChild(happyBtn); // 기뻐요

        let sadBtn = document.createElement('button');
        sadBtn.classList.add('sad');
        let sadImg = document.createElement('i');
        sadImg.classList.add('ri-emotion-unhappy-line');
        let sadCount = document.createElement('span');
        sadCount.innerText = postData['sadCount'];
        sadCount.classList.add(`sad-count-${postId}`);
        sadBtn.appendChild(sadImg);
        sadBtn.appendChild(sadCount);
        sadBtn.onclick = function() {
            onClickSad(postId, roomId);
        };
        buttonDiv.appendChild(sadBtn); // 슬퍼요

        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.innerText = 'X';
        deleteBtn.onclick = function() {
            onClickDelete(postId, roomId);
        };
        buttonDiv.appendChild(deleteBtn); // 삭제 버튼

        postDiv.classList.add('post-box-me');
        postContainer.classList.add('post-container-me');
    } else {
        let happyBtn = document.createElement('button');
        happyBtn.classList.add('happy');
        let happyImg = document.createElement('i');
        happyImg.classList.add('ri-emotion-happy-line');
        let happyCount = document.createElement('span');
        happyCount.innerText = postData['happyCount'];
        happyCount.classList.add(`happy-count-${postId}`);
        happyBtn.appendChild(happyImg);
        happyBtn.appendChild(happyCount);
        happyBtn.onclick = function() {
            onClickHappy(postId, roomId);
        };
        buttonDiv.appendChild(happyBtn);

        let sadBtn = document.createElement('button');
        sadBtn.classList.add('sad');
        let sadImg = document.createElement('i');
        sadImg.classList.add('ri-emotion-unhappy-line');
        let sadCount = document.createElement('span');
        sadCount.innerText = postData['sadCount'];
        sadCount.classList.add(`sad-count-${postId}`);
        sadBtn.appendChild(sadImg);
        sadBtn.appendChild(sadCount);
        sadBtn.onclick = function() {
            onClickSad(postId, roomId);
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

    postContainer.appendChild(postTime);
    postContainer.appendChild(postDiv);
    postContainer.appendChild(buttonDiv);

    postContainer.classList.add(`post-container-${postId}`);
    // 화면에 추가
    posts.appendChild(postContainer);

    document.querySelector('.post').value = '';
    // controlScrollPost();
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

    if (sadCountElement.classList.contains('checked')) {
        sadCountElement.classList.toggle('checked'); //있으면 없애고
        happyCountElement.classList.toggle('checked'); //얘는 없을 거니까 만듦
    } else {
        happyCountElement.classList.toggle('checked');
    }
}

function createSad(sadData) {
    console.log(sadData);
    let postId = sadData['postId'];
    
    let happySelector = `.happy-count-${postId}`
    let happyCountElement = document.querySelector(happySelector);
    happyCountElement.innerText = sadData['happyCount']; //여기서 접속한 유저의 happyCount가 보여지는 오류?

    let sadSelector = `.sad-count-${postId}`
    let sadCountElement = document.querySelector(sadSelector);
    sadCountElement.innerText = sadData['sadCount'];

    if (happyCountElement.classList.contains('checked')) {
        happyCountElement.classList.toggle('checked');
        sadCountElement.classList.toggle('checked');
    } else {
        sadCountElement.classList.toggle('checked');
    }
}

// function controlScrollPost() {
//     postSection = document.querySelector('.board');
//     postSection.scrollTop = postSection.scrollHeight;
// }
// controlScrollPost();

// 여기 정보 : {id: 55, content: '됏스', room: 10, created_at: '2023-08-10', user__username: 'minseo'}