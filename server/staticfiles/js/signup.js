// 화면이 시작되면 아이디에 바로 포커스
let inputUsername = document.getElementById('username');
inputUsername.focus();
const redColor = '#E02B0C';
const carrotColor = '#fba405';
inputUsername.style.borderColor = redColor;
console.log(inputUsername);

/* 로그인 id 중복 검사 Ajax */
const usernameValidateAjax = async(username) => {
    let usernameCookie = document.cookie;
    let csrfToken = usernameCookie.substring(usernameCookie.indexOf('=') + 1);

    const url = '/user/username_check_ajax/';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "charset" : "utf-8",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({username: username}),
    });

    if(res.ok) {
        let {result: result} = await res.json();
        usernameValidateResponse(result);
    }
}

const usernameValidateResponse = (result) => {
    let checker = document.querySelector('.username-check');
    if(result) {
        inputUsername.style.borderColor = carrotColor;
        checker.className = 'username-check';
    } else {
        inputUsername.style.borderColor = redColor;
        checker.classList.add('check-hidden');
    }
}

inputUsername.addEventListener('input', () => {
    usernameValidateAjax(inputUsername.value);
});


/* 비밀번호 유효성 검사 */
let password1 = document.getElementById('password1');
password1.style.borderColor = redColor;

password1.addEventListener('input', () => {
    let checker = document.querySelector('.password1-check');
    const passwordRule = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    if(passwordRule.test(password1.value)) {
        password1.style.borderColor = carrotColor;
        checker.className = 'password1-check';
    } else {
        password1.style.borderColor = redColor;
        checker.classList.add('check-hidden');
    }
})



/* 비밀번호 일치 검사 */
let password2 = document.getElementById('password2');
password2.style.borderColor = redColor;

password2.addEventListener('input', () => {
    const password1 = document.getElementById('password1');
    let checker = document.querySelector('.password2-check');
    if(password2.value === password1.value) {
        password2.style.borderColor = carrotColor;
        checker.className = 'password2-check';
    } else {
        password2.style.borderColor = redColor;
        checker.classList.add('check-hidden');
    }
});

/* 인증번호 엔터 */
document.getElementById('input_authnum').addEventListener('keydown', (event) => {
    if (event.key == 'Enter') {
        event.preventDefault();
        document.querySelector('.signup-input-container #confirm').click();
    }
});

const autoHyphen = (target) => {
    target.value = target.value
      .replace(/[^0-9]/g, '')
      .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/(\-{1,2})$/g, "");
    let btnSendSMS = document.getElementById("send_sms");
    btnSendSMS.classList.add('auth-btn-active');
    btnSendSMS.disabled = false;
}

const delete_hypen = (target) => {
    return target.replace(/-/g, '');
}

// 문자인증+타이머 부분
function initButton(){
    document.getElementById("send_sms").disabled = true;
    document.getElementById("confirm").disabled = true;
    document.getElementById("time_limit").innerText = "03:00";
    document.getElementById("send_sms").classList.remove('auth-btn-active');
    document.getElementById("confirm").classList.remove('auth-btn-active');
}

// 프로세스가 아직 시간되징 않은 상태
let processID = -1;

function send_authnum(){
    console.log("인증번호 Button clicked");
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    //인증번호 보내는 과정 필요 -> views.py의 send_sms 함수를 호출하는 AJAX 요청
    let inputPhoneNumber = document.getElementById("phone_number").value;
    console.log(inputPhoneNumber);
    
    const phonenum_without_hypen = delete_hypen(inputPhoneNumber);
    console.log(phonenum_without_hypen);

    const xhr = new XMLHttpRequest();
    //POST 요청 설정
    xhr.open("POST", "send_sms/", true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("X-CSRFToken", csrfToken);

    // 응답 처리
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log(response.message);
                // 서버 응답 처리
            } else {
                console.error("Error:", xhr.status);
                // 에러 처리
            }
        }
    };
    
    // 요청 보내기
    const data = JSON.stringify({ phone_num: phonenum_without_hypen });
    xhr.send(data);

    // 인증하기 버튼 활성화
    let inputTds = document.querySelectorAll('.input_sms');
    inputTds.forEach(element => {
        element.className = 'input_sms';
    });
    document.getElementById("input_authnum").focus();
    btnAuthConfirm = document.getElementById("confirm");
    btnAuthConfirm.classList.add('auth-btn-active');
    btnAuthConfirm.disabled = false;

    //이전에 실행중인 타이머 프로세스가 있으면 종료
    if (processID != -1) clearInterval(processID);
    
    let time = 180;

    // 50ms마다 타이머를 갱신하고 체크
    processID = setInterval(function () {
        // 타이머가 음수가 되거나, "인증번호 전송" 버튼이 비활성화되면 종료 및 버튼 초기화
        if (time < 0 || document.getElementById("send_sms").disabled) {
        clearInterval(processID);
        initButton();
        return;
        }
        // 남은 시간을 분으로 계산하고 두 자리로
        let mm = String(Math.floor(time / 60)).padStart(2, "0");
        // 남은 시간의 초 부분은 두 자리로
        let ss = String(time % 60).padStart(2, "0");
        // 분과 초를 합쳐서 시간 형식으로
        let result = mm + ":" + ss;
        document.getElementById("time_limit").innerText = result;
        time--;
    }, 1000);

}


function confirm_authnum(){
    console.log("인증하기 button clicked");
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    let inputPhoneNumber = document.getElementById("phone_number").value;
    const phonenum_without_hypen = delete_hypen(inputPhoneNumber);
    console.log(phonenum_without_hypen);

    const inputAuthNumber = document.getElementById("input_authnum").value;
    console.log(inputAuthNumber);

    const onAuthReq = async(phonenum_without_hypen, inputAuthNumber, inputPhoneNumber) => {
        const url = '/user/signup/authcheck/';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "charset" : "utf-8",
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify({ phone_num: phonenum_without_hypen, auth_num: inputAuthNumber, hypen_phone_num: inputPhoneNumber}),
        });
        const {is_auth: isAuth} = await res.json();

        authHandleResponse(isAuth);
    }
    //응답처리
    const authHandleResponse = (isAuth) => {
        // // 성공적으로 처리되었을 때 UI 업데이트
        if(isAuth) {
            document.getElementById('confirm').innerText="인증완료";
            alert('문자 인증이 완료되었습니다.');
            initButton();
            let btnSignup = document.getElementById('signup_button');
            btnSignup.classList.add('auth-btn-active');
            btnSignup.disabled = false;
        } else {
            console.log('error');
        }
    }
    
    // 요청 보내기
    onAuthReq(phonenum_without_hypen, inputAuthNumber, inputPhoneNumber);
}

function validateForm() {
    let form = document.forms["signup-form"];
    form.forEach(element => {
        if (element.value == "") {
          alert(`${element} 항목이 누락되었습니다.`);
          return false;
        }
    });
    return true;
}

function signup_check(){
    if(validateForm())
        alert("가입이 완료되었습니다.");
}

//비밀번호 확인