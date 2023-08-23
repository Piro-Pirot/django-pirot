// scroll 함에 따라 해당 Section 커지는 애니메이션
let sections = document.querySelectorAll('section');
sections = Array.from(sections);
sections = sections.slice(1);

window.onscroll = () => {
  sections.forEach(section => {
    let top = window.scrollY;
    let sectionTop = section.offsetTop - 600;
    let sectionHeight = section.offsetHeight;

    if (top >= sectionTop && top <= sectionTop + sectionHeight + 220) {
      section.classList.add('show-animation');
    }
    else {
      section.classList.remove('show-animation');
    }
  });
}

// Navbar 고정 구현 및 스크롤 내리면 변하는 애니메이션 구현
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('nav');
  navbar.classList.toggle("sticky", window.scrollY > 100);
})

// 페이지 새로고침 시, 가장 상단으로 이동
window.onload = function() {
  setTimeout (function() {
    scrollTo(0, 0);
  }, 0)
};


const loginModal = document.querySelector("#loginModal");
const signupLogoutButton = document.querySelector("#signupAndLogout");
const signupModal = document.querySelector("#signupModal");
const closeButtons = document.querySelectorAll("#close-btn");

// 회원가입 버튼 누르면 모달창 팝업
signupLogoutButton.addEventListener("click", () => {
  if (signupLogoutButton.innerText === '회원가입') {
    signupModal.showModal();
    signupModal.style.opacity = '1';
  }
  else if (signupLogoutButton.innerText === '로그아웃') {
    location.href = '/user/logout/';
  };
});

// X 버튼 누르면 모달창 나가짐
closeButtons.forEach(closeButton => {
  closeButton.addEventListener("click", () => {
    if(loginModal.open) {
      loginModal.close();
      loginModal.style.opacity = '0';
    }
    else if (signupModal.open) {
      signupModal.close();
      signupModal.style.opacity = '0';
    }
  });
});


// Esc 누르면 모달의 opacity를 0으로 초기화 시킴
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    loginModal.style.opacity = '0';
    signupModal.style.opacity = '0';
  }
});


//내브바 메뉴 누르면 맞는 섹션으로 자동 스크롤
const serviceButton = document.getElementById("service");
serviceButton.addEventListener("click", () => {
  let firstSectionTop = sections[0].offsetTop;
  window.scrollTo({top: firstSectionTop, behavior: 'smooth'});
});

const creatorButton = document.getElementById("creator");
creatorButton.addEventListener("click", () => {
  let lastSectionTop = sections[5].offsetTop;
  window.scrollTo({top: lastSectionTop, behavior: 'smooth'});
});

// footer 로고 클릭 상단
const footerLogo = document.querySelector('#footer-right-img');
const footerLogoMob = document.querySelector('.footer-logo-img');

footerLogo.addEventListener('click', () => {
  scrollTo(0,0);
});

try {
  footerLogoMob.addEventListener('click', () => {
    scrollTo(0,0);
  });
} catch {
  console.log('screeeeeeen');
}

// 비밀번호 분실
const btnLostPw = document.getElementById('lost-password');
const formLostPw = document.getElementById('form-lost-pw');
const emailHidden = document.getElementById('lost-pw-email');
const idHidden = document.getElementById('lost-id');
btnLostPw.addEventListener('click', () => {
    const lostPwId = prompt('비밀번호를 재설정합니다.\n회원님의 아이디를 입력하세요.');
    idHidden.value = lostPwId;
    const lostPwEmail = prompt('비밀번호를 재설정합니다.\n재설정된 비밀번호를 받을 이메일을 작성하세요.');
    emailHidden.value = lostPwEmail;

    if (lostPwId !== null && lostPwEmail !== null) {
      formLostPw.submit();
    }
});