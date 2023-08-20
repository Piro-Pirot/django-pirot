const btnEditPhone = document.getElementById('edit-phone_num');

btnEditPhone.addEventListener('click', () => {
    if(btnEditPhone.innerText == '수정') {
        btnEditPhone.innerText = '적용';
        document.querySelector('.setting-phone-num').disabled = False;
    } else if(btnEditPhone.innerText == '적용') {
        btnEditPhone.innerText = '수정';
        // editPhoneAjax
    }
})