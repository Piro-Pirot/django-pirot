// const loadreddots = async(roomId, curUsername) => {
//     const url = '/room/create_reddots_ajax/';
//     const res = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': csrfToken
//         },
//         body: JSON.stringify({roomId: roomId, curUsername: curUsername})
//     });

//     if (res.ok) {
//         let {result: ajaxPosts} = await res.json();
//         ajaxPosts = JSON.parse(ajaxPosts);

//         loadPostsResponse(ajaxPosts);
//     }
// }

// const loadPostsResponse = (ajaxPosts) => {
//     ajaxPosts.forEach(element => createPost(element));
// }

// loadPosts(curRoomId, curUsername);

// function createReddots(data) {
//     redDots.appendChild(postContainer);

//     document.querySelector('.room-red-dot dot-{{ room.room.id }}').innerHTML = newMessagesCount;

// }