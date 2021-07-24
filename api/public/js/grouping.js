let globalData;
let activityName;
let totalTeamNum;
(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    activityName = urlParams.get('id');
    document.getElementById('activityName').innerHTML = `${activityName}`;
})();

const fetchTotalTeamNum = async (activityName) => {
    const data = {
        activityName,
    };
    try {
        return fetch('/api/findTotalTeamNum', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                return response.length;
            })
            .catch((error) => console.error('Error:', error));
    } catch (error) {
        return;
    }
};
// 2, 2
// 2, 3
// 3, 3
// 3, 4
// ...
// 8 + 9
// 9 + 9
//

// 9  = 4 + 5
// 25 = 12 + 13
//    = 6 + 6 + 6 + 7
// 23 = 11 + 12
//    = 5 + 6 + 6 + 6
//    = 2 + 3 + 3 + 3 + 3 + 3 + 3 + 3

// 17 = 8 + 9
//    = 4 + 4 + 4 + 5 (5 = 2 + 3)
//    = 4 + 4 + 4 + 2 + 3

// fair team generate
const getFairTeams = (num, magic = false) => {
    const magicTeam = [9, 17, 18, 19];
    if (magicTeam.includes(num)) magic = true;
    if (num == 2) return [1, 1, null, null];
    else if (num == 3) return [1, 1, 1, null];
    else if (num == 4 && magic == false) return [1, 1, 1, 1];
    else if (num == 4 && magic == true)
        return getFairTeams(Math.floor(num / 2)).concat(getFairTeams(Math.ceil(num / 2)));
    else return getFairTeams(Math.floor(num / 2), magic).concat(getFairTeams(Math.ceil(num / 2), magic));
};

// data initialize
const dataGenerate = (teamNum) => {
    let powNum;
    for (let i = 0; i <= 6; i++) {
        if (Math.pow(2, i) >= teamNum) {
            powNum = Math.pow(2, i);
            break;
        }
    }
    const data = {
        teams: [],
        results: [],
        size: powNum,
        round: 1,
    };

    const randomTeam = getRandomTeam(teamNum);
    const fairTeams = getFairTeams(teamNum);
    let randomTeamIndex = 0;

    // for (let i = 4; i <= 32; i++) {
    //     console.log('teamNum', i, 'fairTeams', getFairTeams(i));
    // }
    // round init
    for (let i = 0; Math.pow(2, i) <= powNum; i++) {
        data['results'][i] = [];
    }
    // teams init
    for (let i = 0; i < powNum; i += 2) {
        if (fairTeams[i] == 1 && fairTeams[i + 1] == 1) {
            data['teams'].push([randomTeam[randomTeamIndex], randomTeam[randomTeamIndex + 1]]);
            randomTeamIndex += 2;
        } else if (fairTeams[i] == 1 && fairTeams[i + 1] == null) {
            data['teams'].push([randomTeam[randomTeamIndex], null]);
            randomTeamIndex += 1;
        } else {
            data['teams'].push([null, null]);
        }
        data['results'][0].push([, , { round: 0, match: i / 2 }]);
    }
    return data;
};

// generate random team
const getRandomTeam = (teamNum) => {
    const array = [];
    for (let i = 0; i < teamNum; i++) {
        array.push(`Team ${i + 1}`);
    }

    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

// simulate battle result of all team from calling api
const battleOfTheRest = (size, round) => {
    let scoreArr = [];

    for (let i = 0; i < size / Math.pow(2, round); i += 2) {
        if (!globalData['results'][round][i / 2]) {
            window.alert('請先完成上一回合的晉級，在使用本按鈕');
        }
        const hasBattled = Number.isInteger(globalData['results'][round][i / 2][0]);
        const tmpData = {
            round: round,
            match: i / 2,
            notShow: true,
        };

        if (!hasBattled) {
            battleOfTwoTeam(tmpData);
        }
    }
    scoreArr = globalData['results'][round];
    return scoreArr;
};

const viewDetailOrShowResult = (team1, team2) => {
    if (confirm(`觀看 ${team1} 和 ${team2} 的對戰過程嗎？`)) {
        // window.open(`/watermelonChess/${team1}/${team2}`);
        const getUrlString = location.href;
        const url = new URL(getUrlString);
        const activityName = url.searchParams.get('id');
        window.open(
            window.location.protocol +
                '//' +
                window.location.hostname +
                `:3080/watermelonChess/${activityName}/${team1}/${team2}`
        );
    }
};
const fetchPythonCode = async (player) => {
    const data = {
        teamName: player,
    };
    try {
        return fetch('/api/findOnePythonCode', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                return response.pythonCode;
            })
            .catch((error) => console.error('Error:', error));
    } catch (error) {
        return;
    }
};
const fetchBattleProcess = async (pythonCodeData) => {
    if (pythonCodeData) {
        const formData = new FormData();
        formData.append('pythonCodeData', JSON.stringify(pythonCodeData));
        try {
            return fetch('http://140.122.164.194:5000/battle', {
                mode: 'cors',
                method: 'post',
                body: formData,
            })
                .then((response) => {
                    return response.json();
                })
                .then((response) => {
                    console.log('battle response', response);
                    return response;
                })
                .catch((error) => console.error('Error:', error));
        } catch (error) {
            return;
        }
    }
};
const fetchInsertBattleProcess = async (fetchBattleProcessDataResult, activityName, team1, team2) => {
    const { process, win: winner, totalSteps } = fetchBattleProcessDataResult;
    const data = {
        activityName,
        playerA: team1,
        playerB: team2,
        process,
        totalSteps,
        //winner 可能會是"Red",'Yellow','Even'
        winner: winner == 'Red' ? team1 : winner == 'Yellow' ? team2 : 'No Team',
    };
    try {
        return fetch('/api/insertBattleProcess', {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                return response;
            })
            .then((response) => console.log('Success:', response))
            .catch((error) => console.error('Error:', error));
    } catch (error) {
        return;
    }
};
// simulate battle result from calling api
const battleOfTwoTeam = async (data) => {
    const { round, match, notShow } = data;
    const team1 =
        document.getElementsByClassName('round')[round].childNodes[match].childNodes[0].childNodes[0].childNodes[0]
            .innerText;
    const team2 =
        document.getElementsByClassName('round')[round].childNodes[match].childNodes[0].childNodes[1].childNodes[0]
            .innerText;
    if (team1 === 'TBD' || team2 === 'TBD' || team1 === 'BYE' || team2 === 'BYE') {
        // window.alert("Can't battle with TBD team.");
        return;
    }
    // node.js save result (score included) to db
    //TODO:錯誤處理：fetchPythonCode 有誤要跳 alert
    const fetchPythonCodeDataResultOfPlayerA = await fetchPythonCode(team1).then((response) => response);
    const fetchPythonCodeDataResultOfPlayerB = await fetchPythonCode(team2).then((response) => response);
    const pythonCodeData = {
        pythonCodeA: fetchPythonCodeDataResultOfPlayerA,
        pythonCodeB: fetchPythonCodeDataResultOfPlayerB,
    };
    //利用 python code 取得對戰過程
    const fetchBattleProcessDataResult = await fetchBattleProcess(pythonCodeData).then((response) => response);
    // Hint: fetchBattleProcessDataResult 上方是線上版，下方是測試資料
    // const fetchBattleProcessDataResult = {
    //     process: [
    //         {
    //             step: 1,
    //             moving: 'Red',
    //             movingBoardIndex: 4,
    //             movingTo: 6,
    //             movingChessIndex: 3,
    //             kill: [],
    //         },
    //         {
    //             step: 2,
    //             moving: 'Yellow',
    //             movingBoardIndex: 17,
    //             movingTo: 13,
    //             movingChessIndex: 1,
    //             kill: [],
    //         },
    //         {
    //             step: 3,
    //             moving: 'Red',
    //             movingBoardIndex: 5,
    //             movingTo: 8,
    //             movingChessIndex: 4,
    //             kill: [],
    //         },
    //     ],
    //     totalSteps: 3,
    //     win: 'Red',
    // };
    const getUrlString = location.href;
    const url = new URL(getUrlString);
    const activityName = url.searchParams.get('id');
    // get socreI, scoreII from db through team1, team2
    await fetchInsertBattleProcess(fetchBattleProcessDataResult, activityName, team1, team2);

    if (!notShow && team1 !== 'TBD' && team2 !== 'TBD' && team1 !== 'BYE' && team2 !== 'BYE') {
        viewDetailOrShowResult(team1, team2);
    }

    const scoreI = fetchBattleProcessDataResult.win === 'Red' ? 1 : 0;
    const scoreII = fetchBattleProcessDataResult.win === 'Yellow' ? 1 : 0;

    // update result of this round
    globalData['results'][round][match] = [
        scoreI >= scoreII ? 1 : 0,
        scoreII >= scoreI ? 1 : 0,
        { round: round, match: match },
    ];

    // initialize result of next round
    globalData['results'][round + 1][match] = [, , { round: round + 1, match: match }];

    plot(globalData, false);
};

// initialize next round match info
const resultsInit = (size, nextRound) => {
    const scoreArr = [];

    for (let i = 0; i < size / Math.pow(2, nextRound); i += 2) {
        scoreArr.push([, , { round: nextRound, match: i / 2 }]);
    }
    return scoreArr;
};

function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

// TODO: need auto generate the logic function of each round
const firstRound = () => {
    globalData['results'][0] = battleOfTheRest(globalData['size'], 0);
    globalData['results'][1] = resultsInit(globalData['size'], 1);
    plot(globalData);
    document.getElementById('first').disabled = true;
};

const secondRound = () => {
    globalData['results'][1] = battleOfTheRest(globalData['size'], 1);
    globalData['results'][2] = resultsInit(globalData['size'], 2);
    plot(globalData);
    document.getElementById('second').disabled = true;
};

const thirdRound = () => {
    globalData['results'][2] = battleOfTheRest(globalData['size'], 2);
    globalData['results'][3] = resultsInit(globalData['size'], 3); // set 2 because of the third place and the forth place
    plot(globalData);
    document.getElementById('third').disabled = true;
};

// const xRound = (round) => {
//     if (globalData['results'][round].length == 0) return; // ?
//     globalData['results'][round] = battleOfTheRest(globalData['size'], round);
//     globalData['results'][round + 1] = resultsInit(globalData['size'], round + 1);
//     plot(globalData);
//     document.getElementById('round' + round).disable = true;
// };

// const finalRound = () => {
//     globalData['results'][3] = battleOfTheRest(globalData['size'], 2);
//     plot(globalData);
//     document.getElementById('final').disable = true;
// };

// edited mode
const setUp = () => {
    plot(globalData, true);
    document.getElementById('status').innerHTML = '編輯模式';
    document.getElementById('saveButton').style.background = '#d1d1d1';
    document.getElementById('saveButton').style.color = 'black';
    document.getElementById('editButton').style.backgroundColor = 'rgb(53, 53, 233)';
    document.getElementById('editButton').style.color = '#ffffff';
};

const setDown = () => {
    plot(globalData, false);
    document.getElementById('status').innerHTML = '對戰模式';
    document.getElementById('saveButton').style.background = 'rgb(53, 53, 233)';
    document.getElementById('saveButton').style.color = '#ffffff';
    document.getElementById('editButton').style.backgroundColor = '#d1d1d1';
    document.getElementById('editButton').style.color = 'black';
};

const saveFn = (data, userData) => {
    globalData['teams'] = data['teams'];
};

const plot = (data, edit = false) => {
    if (edit) {
        $(function () {
            const container = $('#team');
            container.bracket({
                init: data,
                disableToolbar: true,
                centerConnectors: true,
                save: saveFn,
                teamWidth: 90,
                scoreWidth: 20,
                roundMargin: 40,
                matchMargin: 40,
            });
        });
    } else {
        // onMatchClick can't implement with edit mode (jQuery)
        $(function () {
            const container = $('#team');
            container.bracket({
                init: data,
                centerConnectors: true,
                onMatchClick: battleOfTwoTeam,
                //onMatchHover
                teamWidth: 90,
                scoreWidth: 20,
                roundMargin: 40,
                matchMargin: 50,
            });
        });
    }
};

const teamGenerate = (totalTeamNum = 8) => {
    globalData = dataGenerate(totalTeamNum);
    plot(globalData);

    // const mappingButtonTitle = {
    //     0: '第一回合',
    //     1: '第二回合',
    //     2: '第三回合',
    //     3: '第四回合',
    //     4: '第五回合',
    // };

    //創造剩餘組別對戰的button
    // for (let i = 0; i < parseInt(getBaseLog(2, totalTeamNum)); i++) {
    //     const xRoundButton = document.createElement('button');
    //     xRoundButton.id = 'round' + i;
    //     xRoundButton.className = 'roundButton';
    //     xRoundButton.innerHTML = mappingButtonTitle[i];
    //     xRoundButton.setAttribute('onClick', 'xRound(' + i + ')');
    //     document.getElementById('roundButtons').appendChild(xRoundButton);
    // }
};

//取得這個活動有幾組
window.onload = async () => {
    totalTeamNum = await fetchTotalTeamNum(activityName);
    teamGenerate(totalTeamNum);
};
