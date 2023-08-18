if (matchMedia("(max-width: 768px)").matches) {
    // 세로 아이콘바 가리기
    document.querySelector('.icon-bar').classList.add('hide-element');
    // 가로 아이콘바 보이기
    document.querySelector('.mob-icons').classList.remove('hide-element');
}