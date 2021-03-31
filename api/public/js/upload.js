const fileInput = document.querySelector('.button-wrapper');
function processSelectedFiles(fileInput) {
    var files = fileInput.files;
    document.getElementById('file-return').innerHTML = files[0].name;
}
const uploadTeamFile = () => {
    const getUrlString = location.href;
    const url = new URL(getUrlString);
    const teamId = url.searchParams.get('userId');

    const input = document.querySelector('input[type="file"]');

    if (teamId) {
        const data = {
            teamId,
        };
        const formData = new FormData();
        for (file of input.files) {
            formData.append('files', file, file.name);
        }
        formData.append('data', JSON.stringify(data));

        fetch('/api/uploadFile', {
            method: 'post',
            body: formData,
        })
            .then((response) => {
                console.log('uploadFile response', response);
                return response;
            })
            .then((response) => {
                if (response.status == 200) {
                    console.log('Success:', response);
                    alert(`完成提交！`);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(`上傳失敗`);
            });
    } else {
        alert('請登入');
        window.location.href = './main';
    }
};
