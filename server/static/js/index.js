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

const loginButton = document.querySelector("#login");
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

const serviceButton = document.querySelector("#service");
serviceButton.addEventListener("click", () => {
  let firstSectionTop = sections[0].offsetTop;
  window.scrollTo({top: firstSectionTop, behavior: 'smooth'});
});

const creatorButton = document.querySelector("#creator");
creatorButton.addEventListener("click", () => {
  let lastSectionTop = sections[7].offsetTop;
  window.scrollTo({top: lastSectionTop, behavior: 'smooth'});
});


const NavBtn = document.querySelector('.nav-right-mobile');
const MobileMenu = document.querySelector('.nav-right-mobile-menu');

NavBtn.addEventListener('click', () => {
  MobileMenu.classList.toggle("active"); 
  NavBtn.classList.toggle("active");
});