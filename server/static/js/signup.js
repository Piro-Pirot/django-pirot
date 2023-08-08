function input_phone_num(){
    document.getElementById("send_sms").focus();
    document.getElementById("send_sms").setAttribute("style", "background-color:yellow;")
    document.getElementById("send_sms").disabled = false;
}

// 문자인증+타이머 부분
function initButton(){
    document.getElementById("send_sms").disabled = true;
    document.getElementById("confirm").disabled = true;
    document.getElementById("certificationNumber").innerHTML = "000000";
    document.getElementById("timeLimit").innerHTML = "03:00";
    document.getElementById("send_sms").setAttribute("style","background-color:none;")
    document.getElementById("confirm").setAttribute("style","background-color:none;")
}

function check_authnum(){

}

// 프로세스가 아직 시간되징 않은 상태
let processID = -1;

const send_authnum = () => {
    //인증확인 버튼이 활성화되기 전에 인증번호 제대로 입력했는지 확인하는 과정이 필요(ajax)
    $.ajax({
        url:"",
        method: "POST",
        success: function(response){
            console.log(response.message);
        },
        error: function(error){
            console.error(error);
        }
    });

    // 인증확인 버튼 활성화
    document.getElementById("confirm").setAttribute("style","background-color:yellow;")
    document.getElementById("confirm").disabled = false;

    //이전에 실행중인 타이머 프로세스가 있으면 종료
    if (processID != -1) clearInterval(processID);
    //6자리의 무작위 인증번호 생성
    const token = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
    document.getElementById("certificationNumber").innerText = token;
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
    }, 50);
};


function confirm_authnum(){
    alert('문자 인증이 완료되었습니다.')
    initButton();
    document.getElementById('confirm').innerHTML="인증완료"
    document.getElementById('signup_button').disabled = false;
    document.getElementById('signup_button').setAttribute("style", "background-color:yellow;")
}

function signup_check(){
    alert("가입이 완료되었습니다.")
}

$(document).ready(function(){
    $("#send_sms").click(function(){
        // const phone_num = $("#phone_number").val();

        // $.ajax({
        //     type: "POST",
        //     url:"",
        //     data:{
        //         phone_num:phone_num
        //     },
        //     success: function(response){

        //     }
        // });
        send_authnum();
    });
});