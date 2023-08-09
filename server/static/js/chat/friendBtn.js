
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



//친구들 프로필 호버 했을 떄 더보기 버튼 뜨기
const friendContainer = document.querySelectorAll(".friend-container");

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

  const bookmarkButton = container.querySelector("#bookmark");
  const bookmarkIcon = container.querySelector("#star");
  bookmarkButton.addEventListener("click", () => {
    if (bookmarkIcon.classList.contains("active")) {
      bookmarkIcon.classList.toggle("active");
      bookmarkButton.value = '즐겨찾기';
    }
    else {
      bookmarkIcon.classList.toggle("active");
      bookmarkButton.value = '즐겨찾기 해제';
    }
  });

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

const friends = document.querySelectorAll(".friend-container");
console.log(friends);



