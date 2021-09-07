const fileInput = document.querySelector('.button-wrapper');
function processSelectedFiles(fileInput) {
    var files = fileInput.files;
    document.getElementById('file-return').innerHTML = files[0].name;
}
const fetchUploadDealine = async (teamId, activityName, teamName) => {
    const data = {
        teamId,
        activityName,
        teamName,
    };
    try {
        return fetch('/api/getfileUploadDeadline', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                return response.uploadFileDeadline;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    } catch (error) {
        return;
    }
};

const timeToFormat = (time) => {
    let newDate = new Date(time);
    return newDate.getTime();
};

const uploadTeamFile = async () => {
    const getUrlString = location.href;
    const url = new URL(getUrlString);
    const teamId = url.searchParams.get('teamId');
    const teamName = url.searchParams.get('teamName');
    const activityName = url.searchParams.get('activityName');
    const input = document.querySelector('input[type="file"]');
    if (teamId && teamName) {
        const deadline = await fetchUploadDealine(teamId, activityName, teamName);
        let now = new Date();
        if (timeToFormat(deadline) < timeToFormat(now)) {
            alert('上傳時間已截止');
            window.location.href = './main';
        } else {
            const formData = new FormData();
            for (file of input.files) {
                formData.append('files', file, file.name);
            }
            formData.append('teamId', JSON.stringify(teamId));
            fetch('http://140.122.164.194:5000/upload', {
                mode: 'cors',
                method: 'post',
                body: formData,
            })
                .then((response) => {
                    console.log('upload response', response);
                    if (response.status !== 200) {
                        throw error;
                    }
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
                    //     'C0C1 = None\nC2C3 = None\nC4C5 = None\n\n\nfor C0C1 in board[yellow_player]:\n  if C0C1 != 0:\n    for C2C3 in Neighbor(C0C1):\n      if Exist_Chess(C2C3) == 0:\n        score = (score + 20)\n      elif Exist_Chess(C2C3) == 2:\n        score = (score + 15)\n      else:\n        score = (score - 20)\n';
                    // const standardCode =
                    //     'C0C1 = None\nC2C3 = None\nC4C5 = None\n\n\nfor C0C1 in board[yellow_player]:\n  if C0C1 != 0:\n    for C2C3 in Neighbor(C0C1):\n      if Exist_Chess(C2C3) == 0:\n        score = (score + 20)\n      elif Exist_Chess(C2C3) == 2:\n        score = (score + 15)\n      else:\n        score = (score - 20)\n';
                    if (code === '') {
                        throw error;
                    }
                    const pythonCodeData = {
                        pythonCodeA: code,
                        pythonCodeB: '',
                    };
                    const newFormData = new FormData();
                    newFormData.append('pythonCodeData', JSON.stringify(pythonCodeData));

                    fetch('http://140.122.164.194:5000/battle', {
                        mode: 'cors',
                        method: 'post',
                        body: newFormData,
                    })
                        .then((response) => {
                            console.log('battle response', response);
                            if (response.status === 500) {
                                throw error;
                            }
                            return response.json();
                        })
                        .then((response) => {
                            fetch('/api/insertPythonCode', {
                                method: 'POST',
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
                                        method: 'POST',
                                        body: formData,
                                    })
                                        .then((response) => {
                                            return response;
                                        })
                                        .then((response) => {
                                            if (response.status == 200) {
                                                alert(`完成提交！`);
                                            }
                                        })
                                        .catch((error) => {
                                            alert(`上傳失敗請重新上傳`);
                                            console.error('Error:', error);
                                        });
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                    alert('上傳程式碼有誤，請檢查後再重新上傳');
                                });
                        })
                        .catch((error) => {
                            console.error('Error:', JSON.stringify(error));
                            alert('上傳程式碼有誤，請檢查後再重新上傳');
                        });
                })
                .catch((error) => alert('上傳程式碼有誤，請檢查後再重新上傳'));
        }
    } else {
        alert('請登入');
        window.location.href = './main';
    }
};
