function input_phone_num(){
    console.log("phone number inputed");
    document.getElementById("send_sms").focus();
    document.getElementById("send_sms").setAttribute("style", "background-color:yellow;")
    document.getElementById("send_sms").disabled = false;
}

// 문자인증+타이머 부분
function initButton(){
    document.getElementById("send_sms").disabled = true;
    document.getElementById("confirm").disabled = true;
    document.getElementById("timeLimit").innerHTML = "03:00";
    document.getElementById("send_sms").setAttribute("style","background-color:none;")
    document.getElementById("confirm").setAttribute("style","background-color:none;")
}

// 프로세스가 아직 시간되징 않은 상태
let processID = -1;

function send_authnum(){
    console.log("인증번호 Button clicked");
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

    //인증번호 보내는 과정 필요 -> views.py의 send_sms 함수를 호출하는 AJAX 요청
    const inputPhoneNumber = document.getElementById("phone_number").value;
    console.log(inputPhoneNumber);
    // if (inputPhoneNumber !== null) {
    //     const phoneNum = inputPhoneNumber.value;
    //     // 이후 처리
    // } else {
    //     console.error("Input element is null.");
    // }

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
    const data = JSON.stringify({ phone_num: inputPhoneNumber });
    xhr.send(data);

    // 인증하기 버튼 활성화
    document.getElementById("confirm").setAttribute("style","background-color:yellow;")
    document.getElementById("confirm").disabled = false;

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

    const inputPhoneNumber = document.getElementById("phone_number").value;

    const inputAuthNumber = document.getElementById("input_authnum").value;
    console.log(inputAuthNumber);

    const xhr = new XMLHttpRequest();
    //POST 요청 설정
    xhr.open("POST", "authcheck/", true);
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhr.setRequestHeader("X-CSRFToken", csrfToken);

    // 응답 처리
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log(response.message);
                
            } else {
                console.error("Error:", xhr.status);
                // 에러 처리
            }
        }
    };
    
    // 요청 보내기
    const data = JSON.stringify({ phone_num: inputPhoneNumber, auth_num: inputAuthNumber});
    xhr.send(data);

    // 성공적으로 처리되었을 때 UI 업데이트
    alert('문자 인증이 완료되었습니다.')

    document.getElementById('confirm').innerHTML="인증완료"
    document.getElementById('signup_button').disabled = false;
    document.getElementById('signup_button').setAttribute("style", "background-color:yellow;")
}

function signup_check(){
    alert("가입이 완료되었습니다.")
}