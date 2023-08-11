
// 여기로 happyCount를 어떻게 전달하지?!?!?!?!!!?!?!?!?

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
            onClickHappy(postUser, postId, roomId);
        };
        buttonDiv.appendChild(happyBtn); // 기뻐요

        let sadBtn = document.createElement('button');
        sadBtn.classList.add('sad');
        let sadImg = document.createElement('i');
        sadImg.classList.add('ri-emotion-unhappy-line');
        let sadCount = document.createElement('span');
        sadCount.innerText = '-';
        sadCount.classList.add(`sad-count-${postId}`);
        sadBtn.appendChild(sadImg);
        sadBtn.appendChild(sadCount);
        sadBtn.onclick = function() {
            onClickSad(postUser, postId, roomId);
        };
        buttonDiv.appendChild(sadBtn); // 슬퍼요

        let deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete');
        deleteBtn.innerText = 'X';
        deleteBtn.onclick = function() {
            onClickDelete(postId);
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
            onClickHappy(postUser, postId, roomId);
        };
        buttonDiv.appendChild(happyBtn);

        let sadBtn = document.createElement('button');
        sadBtn.classList.add('sad');
        let sadImg = document.createElement('i');
        sadImg.classList.add('ri-emotion-unhappy-line');
        let sadCount = document.createElement('span');
        sadCount.innerText = '-';
        sadCount.classList.add(`sad-count-${postId}`);
        sadBtn.appendChild(sadImg);
        sadBtn.appendChild(sadCount);
        sadBtn.onclick = function() {
            onClickSad(postUser, postId, roomId);
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

    // 화면에 추가
    posts.appendChild(postContainer);

    document.querySelector('.post').value = '';
    // controlScrollPost();
}

postList.forEach(element => createPost(element));

// 기뻐요, 슬퍼요 만드는 코드

// function createHappy(happyData) {
//     console.log(happyData);
//     let postId = happyData['postId'];
//     let classSelector = `.happy-count-${postId}`
//     let happyCountElement = document.querySelector(classSelector);

//     happyCountElement.innerText = happyData['happyCount'];
// }




// function controlScrollPost() {
//     postSection = document.querySelector('.board');
//     postSection.scrollTop = postSection.scrollHeight;
// }
// controlScrollPost();

// 여기 정보 : {id: 55, content: '됏스', room: 10, created_at: '2023-08-10', user__username: 'minseo'}