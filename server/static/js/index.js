/* window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  
  if (scrolled === scrollable) {
    console.log("You reached to the very bottom!");
  }
}); */

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