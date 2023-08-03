/* window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  
  if (scrolled === scrollable) {
    console.log("You reached to the very bottom!");
  }
}); */


// scroll 함에 따라 해당 Section 커지는 애니메이션
let sections = document.querySelectorAll('section');
sections = Array.from(sections);
sections = sections.slice(1);

window.onscroll = () => {
  sections.forEach(section => {
    let top = window.scrollY;
    let sectionTop = section.offsetTop - 400;
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
