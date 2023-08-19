
//내프로필 호버 했을 떄 더보기 버튼 뜨기
const meContainer = document.querySelector(".friend-list-me-container");
const meMoreButton = meContainer.querySelector("#more");
const meMoreForm = document.querySelector(".friend-list-me-container .more-form");
meContainer.addEventListener("mouseover", () => {
  meMoreButton.style.opacity = "1";
});
meContainer.addEventListener("mouseleave", () => {
  meMoreButton.style.opacity = "0";
});
meMoreButton.addEventListener("click", () => {
  meMoreForm.classList.toggle("active");
  meContainer.classList.toggle("colored");
});
window.addEventListener("click", (event) => {
  if(meMoreForm.classList.contains("active")) {
    if (!meContainer.contains(event.target)) {
      meMoreButton.style.opacity = "0";
      meMoreForm.classList.toggle("active");
      meContainer.classList.toggle("colored");
    };
  }
});


// 친구들 정보 리스트
const friendContainer = document.querySelectorAll(".friend-container");

/* 즐겨찾기 Ajax */
let bookmarkCookie = document.cookie;
let bookmarkCsrfToken = bookmarkCookie.substring(bookmarkCookie.indexOf('=') + 1);

const bookmarkAjax = async(target, passerId) => {
  const url = '/staff/bookmark_ajax/';
  const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': bookmarkCsrfToken,
      },
      body: JSON.stringify({target: target, passerId: passerId, channelId: curChannelId}),
  });
  
  if (res.ok) {
    let {type: type} = await res.json();
    bookmarkResponse(type, passerId);
  }
}

const bookmarkResponse = (type, passerId) => {
  friendContainer.forEach(element => {
    if(element.id === passerId) {
      const container = element;
      const bookmarkButton = container.querySelector(`.b${passerId}`);
      const bookmarkIcon = container.querySelector('#star');
    
      if(type === 'deleted') {
        // 즐겨찾기 삭제된 후
        bookmarkIcon.classList.toggle("active");
        bookmarkButton.value = '즐겨찾기';
      } else if(type === 'added') {
        bookmarkIcon.classList.toggle("active");
        bookmarkButton.value = '즐겨찾기 해제';
        let friends = document.querySelector('.btn-friend-list');
        friends.removeChild(container);
        friends.insertBefore(container, friends.firstChild);
      }
    }
  });
}


const noUserModal= document.querySelector(".no-user-modal");
noUserModal.style.opacity = '0';

// 가입 안 된 사용자 정보 Ajax
// 정보는 중요하니까 POST
const getPasserInfoAjax = async (passerId) => {
  let cookie = document.cookie;
  let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
  const url = '/room/load_passer_info_ajax/';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken
    },
    body: JSON.stringify({ passer_id: passerId })
  });

  if(res.ok) {
    let { passer_name: passerName, passer_phone_num: passerPhoneNum } = await res.json();

    if(passerName !== null && passerPhoneNum !== null) {
      showPhoneNum(passerName, passerPhoneNum);
    }
  }
}

// 모달 열기 
const showPhoneNum = (passerName, passerPhoneNum) => {
  // 모달 내용 설정
  let titleDiv = noUserModal.querySelector('.title');
  titleDiv.innerText = `${passerName}님은`;
  
  let phoneInput = noUserModal.querySelector('.no-user-phone');
  phoneInput.value = passerPhoneNum;

  let noUserDesc1 = noUserModal.querySelector('.no-user-desc1');
  noUserDesc1.innerText = `채널에 등록된 ${passerName}님의 연락처 정보를 안내합니다.`;
  let noUserDesc2 = noUserModal.querySelector('.no-user-desc2');
  noUserDesc2.innerText = '누군가의 소중한 개인정보를 지켜주세요.';

  noUserModal.showModal();
  noUserModal.style.opacity = "1";
}

// 모달 닫기
const noUserCloseButton = document.querySelector(".no-user-modal #close-btn");
noUserCloseButton.addEventListener("click", () => {
  if(noUserModal.open) {
    noUserModal.close();
    noUserModal.style.opacity = '0';
  }
});

//Esc 누르면 모달 opacity 초기화
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    noUserModal.style.opacity = '0';
  }
});

//친구들 프로필 호버 했을 떄 더보기 버튼 뜨기
friendContainer.forEach(container => {
  const moreButton = container.querySelector("#more");
  const moreForm = container.querySelector(".more-form");

  container.addEventListener("mouseover", () => {
    moreButton.style.opacity = "1";
  });
  container.addEventListener("mouseleave", () => {
    moreButton.style.opacity = "0";
  });
  moreButton.addEventListener("click", () => {
    moreForm.classList.toggle("active");
    container.classList.toggle("colored");
  });

  /* 즐겨찾기 버튼에 Ajax 함수 클릭 리스너 등록 */
  let friendId = container.id;
  let btnBookmark = container.querySelector(`.b${friendId}`);
  let fnameLable = container.querySelector('.fname-label');
  let friendName = fnameLable.classList[1];
  btnBookmark.addEventListener('click', () => {
    bookmarkAjax(friendName, friendId)
  });
  
  // 버튼 클릭 리스너 등록
  const noUserBtn = container.querySelector('.no-user-btn');
  try {
    noUserBtn.addEventListener('click', () => {
      getPasserInfoAjax(friendId);
    });
  } catch {
    console.log('no no-user-btn!');
  }

  window.addEventListener("click", (event) => {
    if(moreForm.classList.contains("active")) {
      if (!container.contains(event.target)) {
        moreButton.style.opacity = "0";
        moreForm.classList.toggle("active");
        container.classList.toggle("colored");
      };
    }
  });
});
