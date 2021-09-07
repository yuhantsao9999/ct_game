(() => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    let now = yyyy + '-' + mm + '-' + dd + 'T00:00';
    document.getElementById('uploadDeadline').setAttribute('min', now);
})();

const generateShortKey = (length) => {
    {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
};
const removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
};

document.getElementById('activityName').addEventListener('click', function () {
    document.getElementById('generateTeamId').disabled = true;
});

const copyToText = () => {
    let TextRange = document.createRange();
    TextRange.selectNode(document.getElementById('random-team-id-list'));
    sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(TextRange);
    document.execCommand('copy');
    alert('複製完成！');
};

const isActivityNameExist = async (activityName) => {
    let bool;
    if (activityName) {
        bool = await fetch('/api/checkActivityExist', {
            method: 'POST',
            body: JSON.stringify({ activityName: activityName }),
            headers: {
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                return response;
            })
            .then((response) => {
                if (response.status == 404) {
                    return false;
                } else {
                    return true;
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert(`請重新輸入資料`);
            });
    } else {
        alert(`請重新輸入資料`);
    }
    return bool;
};
const getHint = async () => {
    const activityName = document.getElementById('activityName').value;
    if (!activityName) return;
    if (!(await isActivityNameExist(activityName))) {
        document.getElementById('hint').innerHTML = `恭禧您！${activityName} 可以使用`;
        document.getElementById('hint').style = 'color: green';
        document.getElementById('generateTeamId').disabled = false;
    } else {
        document.getElementById('hint').innerHTML = `此活動名稱 ${activityName} 已被使用，請選擇其他活動名稱`;
        document.getElementById('hint').style = 'color: red';
        document.getElementById('generateTeamId').disabled = true;
    }
};

const insertTeamId = async () => {
    const activityName = document.getElementById('activityName').value;
    if (!(await isActivityNameExist(activityName))) {
        const container = document.getElementById('random-team-id-list');
        removeAllChildNodes(container);

        const activityName = document.getElementById('activityName').value;
        const uploadFileDeadline = document.querySelector('input[type="datetime-local"]').value;
        const teamTotalNumber = Number(document.getElementById('total-team-number').value);

        if (!activityName || !uploadFileDeadline) {
            alert('請輸入完整資料');
        } else if (!teamTotalNumber || teamTotalNumber < 4) {
            alert('小組數量需大於四組');
        } else {
            const dateDiv = document.createElement('div');
            const activityNameContent = document.createTextNode(activityName);
            container.appendChild(dateDiv);
            dateDiv.appendChild(activityNameContent);
            for (i = 1; i < teamTotalNumber + 1; i++) {
                const teamID = generateShortKey(5);
                //給予隊伍隨機代號
                const teamDiv = document.createElement('div');
                const teamLi = document.createElement('li');
                const teamNameContent = document.createTextNode('Team ' + i + ' : ' + teamID);
                teamDiv.appendChild(teamNameContent);
                teamLi.appendChild(teamDiv);

                if (i < 20) {
                    document.getElementById('random-team-id-list').appendChild(teamLi);
                } else {
                    document.getElementById('random-team-id-list2').appendChild(teamLi);
                }

                fetch('/api/insertTeamId', {
                    method: 'POST',
                    body: JSON.stringify({
                        teamID,
                        teamName: `Team ${i}`,
                        activityName,
                        uploadFileDeadline,
                        game: '西瓜棋',
                    }),
                    headers: {
                        'content-type': 'application/json',
                    },
                })
                    .then((response) => {
                        return response;
                    })
                    .then((response) => console.log('Success:', response))
                    .catch((error) => console.error('Error:', error));
            }
        }
    } else {
        alert('此活動名稱已被使用，請選擇其他活動名稱');
    }
};
