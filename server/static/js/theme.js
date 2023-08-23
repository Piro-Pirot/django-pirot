window.addEventListener('DOMContentLoaded', function() {
    // 저장된 테마 가져오기
    var savedTheme = curUserTheme;
    console.log(savedTheme);
    localStorage.setItem('theme', savedTheme);
    
    // 저장된 테마가 있을 경우, 해당 테마로 설정
    if (savedTheme == 'lightMode') {
        this.document.body.classList.remove('dark-mode');
        this.document.body.classList.remove('bw-mode');
        this.document.body.classList.add('light-mode');
    };
    if (savedTheme == 'darkMode') {
      this.document.body.classList.remove('light-mode');
      this.document.body.classList.remove('bw-mode');
      this.document.body.classList.add('dark-mode');
    };
    if (savedTheme == 'bwMode') {
      this.document.body.classList.remove('light-mode');
      this.document.body.classList.remove('dark-mode');
      this.document.body.classList.add('bw-mode');
    };
  });