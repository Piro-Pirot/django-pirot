document.querySelector('#upload-file').addEventListener('change', function() {
   const reader = new FileReader();
   const file = this.files[0];
   const fileSize = file.size;
   if(fileSize >= 600000) {
      alert('파일은 0.5MB 이하만 전송 가능합니다.');
   } else {
      reader.onload = async function() {
         const base64 = this.result.replace(/.*base64,/, '');
         await socket.emit('send_file', {'msg': '', 'file': base64, 'user': curUsername, 'roomId': curRoomId});
      };
      reader.readAsDataURL(this.files[0]);
   }

}, false);

// document.querySelector('#upload-file').addEventListener('change', async function() {
//    const reader = new FileReader();
//    const file = this.files[0];
//    const data = await fetch(reader.readAsDataURL(file))
//    const blob = await data.blob();
//    await socket.emit('send_file', {'msg': '', 'file': blob, 'user': curUsername, 'roomId': curRoomId});
// })
/*
Dropzone.autoDiscover = false;
const dropzone = new Dropzone("form.dropzone", { 
    // url: "http://localhost:8000/bubbles/upload_files/",
   //  method: 'POST',
   //  autoProcessQueue: false,
   //  clickable: true,
   //  autoQueue: false,
   //  maxFiles: 10,
   //  maxFilesize: 20000,
   //  parallelUploads: 10,
   //  uploadMultiple: true,
    addRemoveLinks: true,
    dictRemoveFile: '삭제',

    init: function () {
        // 최초 dropzone 설정시 init을 통해 호출
        console.log('최초 실행');
        let myDropzone = this; // closure 변수 (화살표 함수 쓰지않게 주의)
  
        // 서버에 제출 submit 버튼 이벤트 등록
        document.querySelector('.btn-send-files').addEventListener('click', function () {
            console.log('업로드');

            // 거부된 파일이 있다면
            if (myDropzone.getRejectedFiles().length > 0) {
                let files = myDropzone.getRejectedFiles();
                console.log('거부된 파일이 있습니다.', files);
                return;
            }
  
            myDropzone.processQueue(); // autoProcessQueue: false로 해주었기 때문에, 메소드 api로 파일을 서버로 제출
        });
  
        addedFiles = []
        // 파일이 업로드되면 실행
        this.on('addedfile', function (file) {
           // 중복된 파일의 제거
           if (this.files.length) {
              // -1 to exclude current file
              var hasFile = false;
              for (var i = 0; i < this.files.length - 1; i++) {
                 if (
                    this.files[i].name === file.name &&
                    this.files[i].size === file.size &&
                    this.files[i].lastModifiedDate.toString() === file.lastModifiedDate.toString()
                 ) {
                    hasFile = true;
                    this.removeFile(file);
                 }
              }
              if (!hasFile) {
                 addedFiles.push(file);
              }
           } else {
              addedFiles.push(file);
           }
        });
  
        // 업로드한 파일을 서버에 요청하는 동안 호출 실행
        this.on('sending', function (file, xhr, formData) {
           console.log('보내는중');
           console.log(formData);
        });
  
        // 서버로 파일이 성공적으로 전송되면 실행
        this.on('success', function (file, responseText) {
           console.log('성공');
        });
  
        // 업로드 에러 처리
        this.on('error', function (file, errorMessage) {
           alert(errorMessage);
        });
    },
    parallelUploads : 10,
    autoProcessQueue : false,
    type : 'POST',
    success : function(){
    //   location.reload();
    },
    error : function(e) {
        console.log(e)
        alert('오류가 발생했습니다. 다시 시도해주세요.');
    },
    acceptedFiles : ".jpeg, .jpg, .png, .gif",
    uploadMultiple : true,
});
*/