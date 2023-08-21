function onclickDeleteChannel() {
    const deleteChannelForm = document.getElementById('delete-channel-form')
    
    if (confirm('정말정말로 채널을 삭제하시겠습니까?') == true) {
        deleteChannelForm.submit();
    } else {
        return false;
    }
};