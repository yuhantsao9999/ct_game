const fileInput = document.querySelector('.button-wrapper');
function processSelectedFiles(fileInput) {
    var files = fileInput.files;
    document.getElementById('file-return').innerHTML = files[0].name;
}
const uploadTeamFile = () => {
    const getUrlString = location.href;
    const url = new URL(getUrlString);
    const teamId = url.searchParams.get('teamId');
    const teamName = url.searchParams.get('teamName');
    const input = document.querySelector('input[type="file"]');
    console.log('teamId,teamName', teamId, teamName);
    if (teamId && teamName) {
        const data = {
            teamId,
            teamName,
        };
        const formData = new FormData();
        for (file of input.files) {
            formData.append('files', file, file.name);
        }
        formData.append('data', JSON.stringify(data));
        fetch('http://140.122.164.194:5000/upload', {
            mode: 'cors',
            method: 'post',
            body: formData,
        })
            .then((response) => {
                return response.text();
            })
            .then((response) => {
                let xml, code;
                try {
                    xml = Blockly.Xml.textToDom(response);
                } catch (e) {
                    console.log('xml error', e);
                }

                const demoWorkspace = new Blockly.Workspace();
                Blockly.Xml.domToWorkspace(xml, demoWorkspace);

                code = Blockly.Python.workspaceToCode(demoWorkspace);

                let newFormData = new FormData();
                newFormData.append('team_name', 'test_name');
                newFormData.append('code', code);

                fetch('http://140.122.164.194:5000/save', {
                    mode: 'cors',
                    method: 'post',
                    body: newFormData,
                })
                    .then((response) => {
                        return response.text();
                    })
                    .then((response) => {
                        console.log(response);
                    })
                    .catch((err) => {
                        console.log('error', err);
                    });
            });
        // fetch('/api/uploadFile', {
        //     method: 'post',
        //     body: formData,
        // })
        //     .then((response) => {
        //         console.log('uploadFile response', response);
        //         return response;
        //     })
        //     .then((response) => {
        //         if (response.status == 200) {
        //             console.log('Success:', response);
        //             alert(`完成提交！`);
        //         }
        //     })
        //     .catch((error) => {
        //         console.error('Error:', error);
        //         alert(`上傳失敗`);
        //     });
    } else {
        alert('請登入');
        window.location.href = './main';
    }
};
