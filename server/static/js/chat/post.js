// // 게시글을 만드는 코드 (클라이언트 맞나?)
// function createPost(postData) {
//     console.log(postData);
//     let postId = postData['post__id'] // 삭제를 위해 필요. 근데 여기 post__id가 없을텐데 아직.. 일단
    
//     let postContainer = document.createElement('div');
//     let postDiv = document.createElement('div');
//     let buttonDiv = document.createElement('div')
    
//     // 로그인 사용자가 작성한 게시글인 경우
//     if(postData['user__username'] == curUsername) {
//         let happyBtn = document.createElement('button');
//         happyBtn.innerText('기뻐요'); // 나중에 i 태그
//         happyBtn.classList.add('happy');
//         buttonDiv.appendChild(happyBtn); // 기뻐요

//         let sadBtn = document.createElement('button');
//         sadBtn.classList.add('sad');
//         sadBtn.innerText('슬퍼요');
//         buttonDiv.appendChild(sadBtn); // 슬퍼요

//         let deleteBtn = document.createElement('button');
//         deleteBtn.classList.add('delete');
//         deleteBtn.onclick = function() {
//             onClickDelete(postId);
//         };
//         buttonDiv.appendChild(deleteBtn); // 삭제 버튼

//         postDiv.classList.add('post-box-me');
//         postContainer.classList.add('post-container-me');
//     } else {
//         let happyBtn = document.createElement('button');
//         happyBtn.classList.add('happy');
//         happyBtn.innerText('기뻐요'); // 나중에 i 태그
//         buttonDiv.appendChild(happyBtn); // 기뻐요 버튼

//         let sadBtn = document.createElement('button');
//         sadBtn.classList.add('sad');
//         sadBtn.innerText('슬퍼요');
//         buttonDiv.appendChild(sadBtn); // 슬퍼요 버튼

//         postDiv.classList.add('post-box');
//         postContainer.classList.add('post-container');
//     }

//     // 작성일
//     let postTime = document.createElement('div');
//     postTime.classList.add('post-time');
//     postTime.innerText = postData['created_at']

//     // 내용
//     let postContent = document.createElement('div');
//     postContent.classList.add('post-content');
//     postContent.innerText = postData['content'];
//     postDiv.appendChild(postContent);

//     postContainer.appendChild(postTime);
//     postContainer.appendChild(postDiv);
//     postContainer.appendChild(buttonDiv);

//     // 화면에 추가
//     posts.appendChild(postContainer);

//     document.querySelector('.post').value = '';
//     // controlScroll();
// }

// postList.forEach(element => createPost(element));

// // 기뻐요, 슬퍼요 만드는 코드. 클릭하면 생겨야 함.


function controlScrollPost() {
    postSection = document.querySelector('.board');
    postSection.scrollTop = postSection.scrollHeight;
}
// controlScrollPost();