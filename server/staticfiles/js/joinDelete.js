function onclickDeleteJoin(passerId) {
    const deletedForm = document.getElementById(`delete-form-${passerId}`);
    
    if (confirm('회원을 삭제하시겠습니까?') == true) {
        deletedForm.submit();
    } else {
        return false;
    }
}