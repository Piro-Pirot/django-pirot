// 전화번호 수정

const btnEditPhone = document.getElementById('edit-phone_num');
const inputEditPhone = document.querySelector('.setting-phone-num');

const autoHyphenPhone = (target) => {
    target.value = target.value
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
}

btnEditPhone.addEventListener('click', () => {
    if(btnEditPhone.innerText == '수정') {
        btnEditPhone.innerText = '적용';
        inputEditPhone.disabled = false;
    } else if(btnEditPhone.innerText == '적용') {
        editPhoneAjax(inputEditPhone.value);
    }
});

const editPhoneAjax = async (newPhone) => {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    const url = '/user/update_phone_ajax/';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({new_phone: newPhone})
    });
    
    if(res.ok) {
        let { result: result } = await res.json();
        result = JSON.parse(result);
        if(result === true) {
            alert('전화번호가 변경되었습니다.');
            inputEditPhone.value = newPhone;
            inputEditPhone.disabled = true;
        } else {
            alert('전화번호가 변경되지 않았습니다.');
            inputEditPhone.disabled = true;
        }
        btnEditPhone.innerText = '수정';
    }
}

// 비밀번호 수정
const btnEditPw = document.querySelector('.btn-edit-password');
const inputOldPw = document.querySelector('.origin-pw');
const inputNewPw = document.querySelector('.new-pw');

btnEditPw.addEventListener('click', () => {
    editPwAjax(inputOldPw.value, inputNewPw.value);
});

const editPwAjax = async (oldPw, newPw) => {
    let cookie = document.cookie;
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    const url = '/user/update_pw_ajax/';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({old_pw: oldPw, new_pw: newPw})
    });

    if(res.ok) {
        let { result: result } = await res.json();
        result = JSON.parse(result);
        if(result === true) {
            alert('비밀번호가 변경되었습니다.');
        } else {
            alert('비밀번호가 변경되지 않았습니다.');
        }
        inputOldPw.value = '';
        inputNewPw.value = '';
    }
}
