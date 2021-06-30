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
    const activityName = url.searchParams.get('activityName');
    const input = document.querySelector('input[type="file"]');
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
                // code =
                //     'C0C1C2C3 = None\nC4C5 = None\nC6C7 = None\n\n\nfor C0C1C2C3 in board[yellow_player]:\n  if C0C1C2C3 != 0 or fun_Alive(C4C52(C0C1C2C3)) == False:\n    score = (score + 100)\n';
                fetch('/api/insertPythonCode', {
                    method: 'post',
                    body: JSON.stringify({
                        teamId,
                        activityName,
                        teamName,
                        pythonCode: code,
                    }),
                    headers: {
                        'content-type': 'application/json',
                    },
                })
                    .then((response) => {
                        return response;
                    })
                    .then((response) => {
                        console.log(response);
                        fetch('/api/uploadFileName', {
                            method: 'post',
                            body: formData,
                        })
                            .then((response) => {
                                console.log('uploadFileName response', response);
                                return response;
                            })
                            .then((response) => {
                                if (response.status == 200) {
                                    console.log('Success:', response);
                                    alert(`完成提交！`);
                                }
                            })
                            .catch((error) => {
                                alert(`上傳失敗請重新上傳`);
                                console.error('Error:', error);
                            });
                    })
                    .catch((error) => console.error('Error:', error));
            });
    } else {
        alert('請登入');
        window.location.href = './main';
    }
};
