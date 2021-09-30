let globalData;
let activityName;
let noFileTeams = {};

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
        return fetch('/api/getTotalTeamNum', {
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
                return response.totalTeamNumber;
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('無此活動代碼，請重新輸入');
                window.location = './start';
            });
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
    let round;
    // max round is six
    for (let i = 0; i <= 6; i++) {
        if (Math.pow(2, i) >= teamNum) {
            powNum = Math.pow(2, i);
            break;
        }
        round = i + 1;
    }
    const data = {
        teams: [],
        results: [],
        size: powNum,
        round: round,
    };

    const randomTeam = getRandomTeam(teamNum);
    const fairTeams = getFairTeams(teamNum);
    let randomTeamIndex = 0;

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
            window.alert('請先完成上一回合的晉級，再使用本按鈕');
        }
        const isEven =
            Number(globalData['results'][round][i / 2][0]) + Number(globalData['results'][round][i / 2][1]) == 0;
        const hasBattled = Number.isInteger(globalData['results'][round][i / 2][0]);
        const tmpData = {
            round: round,
            match: i / 2,
            notShow: true,
        };

        if (!hasBattled || isEven) {
            battleOfTwoTeam(tmpData);
        }
    }
    scoreArr = globalData['results'][round];
    return scoreArr;
};

const viewDetailOrShowResult = (team1, team2, isEven) => {
    const copywriting = isEven
        ? `雙方平手，重開新局。
      是否觀看 ${team1} 和${team2} 新一局的對戰過程過程嗎？`
        : `觀看 ${team1} 和 ${team2} 的對戰過程嗎？`;
    if (confirm(copywriting)) {
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
        activityName: activityName,
    };
    try {
        return fetch('/api/findPythonCode', {
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
                return response.pythonCode;
            })
            .catch((error) => {
                console.error(`Error: ${player} PythonCode not found`);
            });
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
                    return response;
                })
                .catch(async (error) => {
                    console.error('Error:', error);
                    return await fetchBattleProcess(pythonCodeData);
                });
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
        process: JSON.stringify(process),
        totalSteps,
        //winner 可能會是"Red",'Yellow','Even'
        winner: winner == 'Red' ? team1 : winner == 'Yellow' ? team2 : 'No Team',
        game: '西瓜棋',
    };
    try {
        return fetch('/api/insertBattleProcess', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                console.log('insertBattleProcess response', response);
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
    const oldScoreI =
        document.getElementsByClassName('round')[round].childNodes[match].childNodes[0].childNodes[0].childNodes[1]
            .innerText;
    const oldscoreII =
        document.getElementsByClassName('round')[round].childNodes[match].childNodes[0].childNodes[1].childNodes[1]
            .innerText;
    const isTeam1Upload =
        document.getElementsByClassName('round')[round].childNodes[match].childNodes[0].childNodes[0].style.color ==
        'red'
            ? false
            : true;
    const isTeam2Upload =
        document.getElementsByClassName('round')[round].childNodes[match].childNodes[0].childNodes[1].style.color ==
        'red'
            ? false
            : true;
    if (team1 === 'TBD' || team2 === 'TBD' || team1 === 'BYE' || team2 === 'BYE') {
        return;
    }
    //已有對戰輸贏不再重新對戰
    if (oldScoreI > 0 || oldscoreII > 0) {
        if (!notShow && team1 !== 'TBD' && team2 !== 'TBD' && team1 !== 'BYE' && team2 !== 'BYE') {
            viewDetailOrShowResult(team1, team2, false);
        }
    } else {
        //尚未有輸贏需要重新對戰
        const fetchPythonCodeDataResultOfPlayerA = await fetchPythonCode(team1).then((response) => response);
        const fetchPythonCodeDataResultOfPlayerB = await fetchPythonCode(team2).then((response) => response);
        const pythonCodeData = {
            pythonCodeA: fetchPythonCodeDataResultOfPlayerA,
            pythonCodeB: fetchPythonCodeDataResultOfPlayerB,
        };
        //利用 python code 取得對戰過程
        if (isTeam1Upload && isTeam2Upload) {
            const fetchBattleProcessDataResult = await fetchBattleProcess(pythonCodeData).then((response) => {
                return response;
            });
            const getUrlString = location.href;
            const url = new URL(getUrlString);
            const activityName = url.searchParams.get('id');
            // get socreI, scoreII from db through team1, team2
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

            // const fetchBattleProcessDataResult = {
            //     process: [
            //         {
            //             step: 1,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 2, 3, 4, 5, 13],
            //                 [15, 17, 18, 19, 20, 21],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 2,
            //             moving: 'Yellow',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 2, 3, 4, 5, 13],
            //                 [15, 14, 18, 19, 20, 21],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 3,
            //             moving: 'Red',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 2, 3, 4, 5, 17],
            //                 [15, 14, 18, 19, 20, 21],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 4,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [1, 2, 3, 4, 5, 17],
            //                 [15, 14, 16, 19, 20, 21],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 5,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [1, 2, 3, 4, 9, 17],
            //                 [15, 14, 16, 19, 20, 21],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 6,
            //             moving: 'Yellow',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 2, 3, 4, 9, 17],
            //                 [15, 13, 16, 19, 20, 21],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 7,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 9, 17],
            //                 [15, 13, 16, 19, 20, 21],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 8,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 9, 17],
            //                 [15, 13, 11, 19, 20, 21],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 9,
            //             moving: 'Red',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 9, 14],
            //                 [15, 13, 11, 19, 20, 21],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 10,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 9, 14],
            //                 [8, 13, 11, 19, 20, 21],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 11,
            //             moving: 'Red',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 15, 14],
            //                 [8, 13, 11, 19, 20, 21],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 12,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 15, 14],
            //                 [8, 13, 11, 19, 17, 21],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 13,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 9, 3, 4, 15, 14],
            //                 [8, 13, 11, 19, 17, 21],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 14,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [1, 9, 3, 4, 15, 14],
            //                 [8, 13, 6, 19, 17, 21],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 15,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 9, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 17, 21],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 16,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 9, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 17, 20],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 17,
            //             moving: 'Red',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 17, 20],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 18,
            //             moving: 'Yellow',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [1, 5, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 14, 20],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 19,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 9, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 14, 20],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 20,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 9, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 14, 18],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 21,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [2, 9, 3, 4, 15, 7],
            //                 [8, 13, 6, 19, 14, 18],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 22,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [2, 9, 3, 4, 15, 7],
            //                 [5, 13, 6, 19, 14, 18],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 23,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [2, 9, 1, 4, 15, 7],
            //                 [5, 13, 6, 19, 14, 18],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 24,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [2, 9, 1, 4, 15, 7],
            //                 [5, 13, 6, 21, 14, 18],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 25,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [2, 9, 3, 4, 15, 7],
            //                 [5, 13, 6, 21, 14, 18],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 26,
            //             moving: 'Yellow',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [2, 9, 3, 4, 15, 7],
            //                 [8, 13, 6, 21, 14, 18],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 27,
            //             moving: 'Red',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [2, 9, 3, 4, 19, 7],
            //                 [8, 13, 6, 21, 14, 18],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 28,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [2, 9, 3, 4, 19, 7],
            //                 [8, 13, 6, 21, 14, 20],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 29,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [2, 9, 3, 1, 19, 7],
            //                 [8, 13, 6, 21, 14, 20],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 30,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [2, 9, 3, 1, 19, 7],
            //                 [8, 12, 6, 21, 14, 20],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 31,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 9, 3, 1, 19, 7],
            //                 [8, 12, 6, 21, 14, 20],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 32,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 9, 3, 1, 19, 7],
            //                 [15, 12, 6, 21, 14, 20],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 33,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 9, 3, 2, 19, 7],
            //                 [15, 12, 6, 21, 14, 20],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 34,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 9, 3, 2, 19, 7],
            //                 [15, 12, 6, 18, 14, 20],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 35,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 7],
            //                 [15, 12, 6, 18, 14, 20],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 36,
            //             moving: 'Yellow',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 7],
            //                 [15, 12, 6, 18, 13, 20],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 37,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 14],
            //                 [15, 12, 6, 18, 13, 20],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 38,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 14],
            //                 [15, 16, 6, 18, 13, 20],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 39,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 17],
            //                 [15, 16, 6, 18, 13, 20],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 40,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 17],
            //                 [15, 16, 11, 18, 13, 20],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 41,
            //             moving: 'Red',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 14],
            //                 [15, 16, 11, 18, 13, 20],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 42,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 19, 14],
            //                 [15, 12, 11, 18, 13, 20],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 43,
            //             moving: 'Red',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 21, 14],
            //                 [15, 12, 11, 18, 13, 20],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 44,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 21, 14],
            //                 [15, 12, 11, 18, 13, 17],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 45,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 21, 7],
            //                 [15, 12, 11, 18, 13, 17],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 46,
            //             moving: 'Yellow',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 2, 21, 7],
            //                 [15, 12, 11, 18, 13, 20],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 47,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 9, 1, 5, 21, 7],
            //                 [15, 12, 11, 18, 13, 20],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 48,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 9, 1, 5, 21, 7],
            //                 [15, 12, 11, 19, 13, 20],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 49,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 9, 1, 5, 21, 14],
            //                 [15, 12, 11, 19, 13, 20],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 50,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 9, 1, 5, 21, 14],
            //                 [8, 12, 11, 19, 13, 20],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 51,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [6, 9, 1, 5, 21, 14],
            //                 [8, 12, 11, 19, 13, 20],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 52,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [6, 9, 1, 5, 21, 14],
            //                 [8, 12, 11, 19, 7, 20],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 53,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 9, 1, 5, 21, 13],
            //                 [8, 12, 11, 19, 7, 20],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 54,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 9, 1, 5, 21, 13],
            //                 [8, 16, 11, 19, 7, 20],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 55,
            //             moving: 'Red',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 10, 1, 5, 21, 13],
            //                 [8, 16, 11, 19, 7, 20],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 56,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 10, 1, 5, 0, 13],
            //                 [8, 18, 11, 19, 7, 20],
            //             ],
            //             movingTo: 18,
            //             kill: [21],
            //         },
            //         {
            //             step: 57,
            //             moving: 'Red',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 10, 1, 5, 0, 13],
            //                 [8, 18, 11, 19, 7, 20],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 58,
            //             moving: 'Yellow',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [4, 10, 1, 5, 0, 13],
            //                 [8, 18, 11, 19, 3, 20],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 59,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 10, 2, 5, 0, 13],
            //                 [8, 18, 11, 19, 3, 20],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 60,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 10, 2, 5, 0, 13],
            //                 [9, 18, 11, 19, 3, 20],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 61,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [1, 10, 2, 5, 0, 13],
            //                 [9, 18, 11, 19, 3, 20],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 62,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [1, 10, 2, 5, 0, 13],
            //                 [9, 18, 11, 21, 3, 20],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 63,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [1, 10, 4, 5, 0, 13],
            //                 [9, 18, 11, 21, 3, 20],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 64,
            //             moving: 'Yellow',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [1, 10, 4, 5, 0, 13],
            //                 [9, 18, 11, 21, 7, 20],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 65,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [1, 10, 3, 5, 0, 13],
            //                 [9, 18, 11, 21, 7, 20],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 66,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [1, 10, 3, 5, 0, 13],
            //                 [9, 18, 11, 19, 7, 20],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 67,
            //             moving: 'Red',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 6, 3, 5, 0, 13],
            //                 [9, 18, 11, 19, 7, 20],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 68,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 6, 3, 5, 0, 13],
            //                 [9, 16, 11, 19, 7, 20],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 69,
            //             moving: 'Red',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [1, 6, 3, 5, 0, 14],
            //                 [9, 16, 11, 19, 7, 20],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 70,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [1, 6, 3, 5, 0, 14],
            //                 [9, 16, 10, 19, 7, 20],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 71,
            //             moving: 'Red',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [1, 4, 3, 5, 0, 14],
            //                 [9, 16, 10, 19, 7, 20],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 72,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [1, 4, 3, 5, 0, 14],
            //                 [9, 16, 10, 18, 7, 20],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 73,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [2, 4, 3, 5, 0, 14],
            //                 [9, 16, 10, 18, 7, 20],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 74,
            //             moving: 'Yellow',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [2, 4, 3, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 20],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 75,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [2, 4, 1, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 20],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 76,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [2, 4, 1, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 21],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 77,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [2, 3, 1, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 21],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 78,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [2, 3, 1, 5, 0, 14],
            //                 [9, 16, 10, 20, 13, 21],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 79,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [2, 7, 1, 5, 0, 14],
            //                 [9, 16, 10, 20, 13, 21],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 80,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [2, 7, 1, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 21],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 81,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [2, 7, 3, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 21],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 82,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [2, 7, 3, 5, 0, 14],
            //                 [9, 16, 10, 18, 13, 19],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 83,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [2, 7, 3, 8, 0, 14],
            //                 [9, 16, 10, 18, 13, 19],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 84,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [2, 7, 3, 8, 0, 14],
            //                 [5, 16, 10, 18, 13, 19],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 85,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [2, 7, 1, 8, 0, 14],
            //                 [5, 16, 10, 18, 13, 19],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 86,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [2, 7, 1, 8, 0, 14],
            //                 [5, 12, 10, 18, 13, 19],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 87,
            //             moving: 'Red',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [2, 7, 1, 9, 0, 14],
            //                 [5, 12, 10, 18, 13, 19],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 88,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [2, 7, 1, 9, 0, 14],
            //                 [5, 12, 10, 18, 17, 19],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 89,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 7, 1, 9, 0, 14],
            //                 [5, 12, 10, 18, 17, 19],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 90,
            //             moving: 'Yellow',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 7, 1, 9, 0, 14],
            //                 [8, 12, 10, 18, 17, 19],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 91,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 7, 1, 9, 0, 13],
            //                 [8, 12, 10, 18, 17, 19],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 92,
            //             moving: 'Yellow',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [4, 7, 1, 9, 0, 13],
            //                 [8, 12, 10, 18, 20, 19],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 93,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [3, 7, 1, 9, 0, 13],
            //                 [8, 12, 10, 18, 20, 19],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 94,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [3, 7, 1, 9, 0, 13],
            //                 [8, 12, 10, 16, 20, 19],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 95,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 7, 1, 9, 0, 13],
            //                 [8, 12, 10, 16, 20, 19],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 96,
            //             moving: 'Yellow',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 7, 1, 9, 0, 13],
            //                 [8, 12, 6, 16, 20, 19],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 97,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 7, 2, 9, 0, 13],
            //                 [8, 12, 6, 16, 20, 19],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 98,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [4, 7, 2, 9, 0, 13],
            //                 [8, 12, 6, 16, 21, 19],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 99,
            //             moving: 'Red',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 7, 2, 5, 0, 13],
            //                 [8, 12, 6, 16, 21, 19],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 100,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 7, 2, 5, 0, 13],
            //                 [8, 12, 6, 11, 21, 19],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 101,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [4, 14, 2, 5, 0, 13],
            //                 [8, 12, 6, 11, 21, 19],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 102,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 14, 2, 5, 0, 13],
            //                 [8, 12, 6, 16, 21, 19],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 103,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 13],
            //                 [8, 12, 6, 16, 21, 19],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 104,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 13],
            //                 [8, 12, 6, 16, 21, 15],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 105,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 14, 2, 5, 0, 13],
            //                 [8, 12, 6, 16, 21, 15],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 106,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 14, 2, 5, 0, 13],
            //                 [8, 12, 6, 18, 21, 15],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 107,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [3, 14, 2, 5, 0, 13],
            //                 [8, 12, 6, 18, 21, 15],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 108,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [3, 14, 2, 5, 0, 13],
            //                 [8, 11, 6, 18, 21, 15],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 109,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [3, 7, 2, 5, 0, 13],
            //                 [8, 11, 6, 18, 21, 15],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 110,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [3, 7, 2, 5, 0, 13],
            //                 [8, 11, 6, 18, 21, 19],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 111,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [1, 7, 2, 5, 0, 13],
            //                 [8, 11, 6, 18, 21, 19],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 112,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [1, 7, 2, 5, 0, 13],
            //                 [15, 11, 6, 18, 21, 19],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 113,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 7, 2, 5, 0, 13],
            //                 [15, 11, 6, 18, 21, 19],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 114,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 7, 2, 5, 0, 13],
            //                 [9, 11, 6, 18, 21, 19],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 115,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 7, 2, 8, 0, 13],
            //                 [9, 11, 6, 18, 21, 19],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 116,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 7, 2, 8, 0, 13],
            //                 [9, 11, 10, 18, 21, 19],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 117,
            //             moving: 'Red',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 7, 2, 5, 0, 13],
            //                 [9, 11, 10, 18, 21, 19],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 118,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 7, 2, 5, 0, 13],
            //                 [15, 11, 10, 18, 21, 19],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 119,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [3, 7, 2, 5, 0, 13],
            //                 [15, 11, 10, 18, 21, 19],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 120,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [3, 7, 2, 5, 0, 13],
            //                 [15, 16, 10, 18, 21, 19],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 121,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [3, 14, 2, 5, 0, 13],
            //                 [15, 16, 10, 18, 21, 19],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 122,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [3, 14, 2, 5, 0, 13],
            //                 [15, 16, 10, 18, 20, 19],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 123,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [3, 14, 1, 5, 0, 13],
            //                 [15, 16, 10, 18, 20, 19],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 124,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [3, 14, 1, 5, 0, 13],
            //                 [15, 16, 10, 18, 20, 21],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 125,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [3, 14, 1, 8, 0, 13],
            //                 [15, 16, 10, 18, 20, 21],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 126,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [3, 14, 1, 8, 0, 13],
            //                 [15, 16, 10, 18, 20, 19],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 127,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 14, 1, 8, 0, 13],
            //                 [15, 16, 10, 18, 20, 19],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 128,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [4, 14, 1, 8, 0, 13],
            //                 [15, 12, 10, 18, 20, 19],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 129,
            //             moving: 'Red',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 13],
            //                 [15, 12, 10, 18, 20, 19],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 130,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 13],
            //                 [9, 12, 10, 18, 20, 19],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 131,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 14, 3, 5, 0, 13],
            //                 [9, 12, 10, 18, 20, 19],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 132,
            //             moving: 'Yellow',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 14, 3, 5, 0, 13],
            //                 [9, 12, 11, 18, 20, 19],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 133,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 13],
            //                 [9, 12, 11, 18, 20, 19],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 134,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 13],
            //                 [8, 12, 11, 18, 20, 19],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 135,
            //             moving: 'Red',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 17],
            //                 [8, 12, 11, 18, 20, 19],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 136,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 14, 1, 5, 0, 17],
            //                 [15, 12, 11, 18, 20, 19],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 137,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [4, 14, 3, 5, 0, 17],
            //                 [15, 12, 11, 18, 20, 19],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 138,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [4, 14, 3, 5, 0, 17],
            //                 [15, 12, 11, 18, 21, 19],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 139,
            //             moving: 'Red',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [4, 14, 3, 5, 0, 20],
            //                 [15, 12, 11, 18, 21, 19],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 140,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [4, 14, 3, 5, 0, 20],
            //                 [9, 12, 11, 18, 21, 19],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 141,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [4, 7, 3, 5, 0, 20],
            //                 [9, 12, 11, 18, 21, 19],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 142,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [4, 7, 3, 5, 0, 20],
            //                 [9, 12, 11, 16, 21, 19],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 143,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 20],
            //                 [9, 12, 11, 16, 21, 19],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 144,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 20],
            //                 [9, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 145,
            //             moving: 'Red',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 17],
            //                 [9, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 146,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 17],
            //                 [9, 12, 11, 16, 21, 19],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 147,
            //             moving: 'Red',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 14],
            //                 [9, 12, 11, 16, 21, 19],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 148,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 14],
            //                 [9, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 149,
            //             moving: 'Red',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 7, 3, 5, 0, 14],
            //                 [9, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 150,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 7, 3, 5, 0, 14],
            //                 [9, 13, 11, 16, 21, 18],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 151,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 7, 3, 5, 0, 17],
            //                 [9, 13, 11, 16, 21, 18],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 152,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 7, 3, 5, 0, 17],
            //                 [9, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 153,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 14, 3, 5, 0, 17],
            //                 [9, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 154,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 14, 3, 5, 0, 17],
            //                 [10, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 155,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 7, 3, 5, 0, 17],
            //                 [10, 13, 11, 16, 21, 19],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 156,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 7, 3, 5, 0, 17],
            //                 [10, 13, 11, 16, 21, 15],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 157,
            //             moving: 'Red',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 17],
            //                 [10, 13, 11, 16, 21, 15],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 158,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 17],
            //                 [10, 13, 11, 16, 21, 8],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 159,
            //             moving: 'Red',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 14],
            //                 [10, 13, 11, 16, 21, 8],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 160,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [6, 7, 3, 5, 0, 14],
            //                 [10, 13, 11, 16, 20, 8],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 161,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [6, 7, 1, 5, 0, 14],
            //                 [10, 13, 11, 16, 20, 8],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 162,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [6, 7, 1, 5, 0, 14],
            //                 [10, 13, 11, 16, 21, 8],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 163,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [6, 7, 2, 5, 0, 14],
            //                 [10, 13, 11, 16, 21, 8],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 164,
            //             moving: 'Yellow',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [6, 7, 2, 5, 0, 14],
            //                 [9, 13, 11, 16, 21, 8],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 165,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [6, 7, 4, 5, 0, 14],
            //                 [9, 13, 11, 16, 21, 8],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 166,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [6, 7, 4, 5, 0, 14],
            //                 [9, 13, 11, 16, 19, 8],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 167,
            //             moving: 'Red',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [10, 7, 4, 5, 0, 14],
            //                 [9, 13, 11, 16, 19, 8],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 168,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 7, 4, 5, 0, 14],
            //                 [9, 13, 12, 16, 19, 8],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 169,
            //             moving: 'Red',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [6, 7, 4, 5, 0, 14],
            //                 [9, 13, 12, 16, 19, 8],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 170,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 7, 4, 5, 0, 14],
            //                 [9, 17, 12, 16, 19, 8],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 171,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [6, 7, 4, 2, 0, 14],
            //                 [9, 17, 12, 16, 19, 8],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 172,
            //             moving: 'Yellow',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 7, 4, 2, 0, 14],
            //                 [9, 13, 12, 16, 19, 8],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 173,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [6, 3, 4, 2, 0, 14],
            //                 [9, 13, 12, 16, 19, 8],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 174,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [6, 3, 4, 2, 0, 14],
            //                 [9, 13, 12, 18, 19, 8],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 175,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [6, 3, 1, 2, 0, 14],
            //                 [9, 13, 12, 18, 19, 8],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 176,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [6, 3, 1, 2, 0, 14],
            //                 [9, 13, 12, 20, 19, 8],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 177,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 3, 1, 2, 0, 7],
            //                 [9, 13, 12, 20, 19, 8],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 178,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [6, 3, 1, 2, 0, 7],
            //                 [9, 13, 12, 20, 18, 8],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 179,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [6, 3, 4, 2, 0, 7],
            //                 [9, 13, 12, 20, 18, 8],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 180,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [6, 3, 4, 2, 0, 7],
            //                 [9, 13, 12, 17, 18, 8],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 181,
            //             moving: 'Red',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [11, 3, 4, 2, 0, 7],
            //                 [9, 13, 12, 17, 18, 8],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 182,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [11, 3, 4, 2, 0, 7],
            //                 [9, 13, 6, 17, 18, 8],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 183,
            //             moving: 'Red',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 3, 4, 2, 0, 7],
            //                 [9, 13, 6, 17, 18, 8],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 184,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 3, 4, 2, 0, 7],
            //                 [5, 13, 6, 17, 18, 8],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 185,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 1, 4, 2, 0, 7],
            //                 [5, 13, 6, 17, 18, 8],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 186,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [12, 1, 4, 2, 0, 7],
            //                 [5, 13, 6, 17, 19, 8],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 187,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [12, 1, 3, 2, 0, 7],
            //                 [5, 13, 6, 17, 19, 8],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 188,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 1, 3, 2, 0, 7],
            //                 [5, 14, 6, 17, 19, 8],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 189,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [12, 1, 4, 2, 0, 7],
            //                 [5, 14, 6, 17, 19, 8],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 190,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 1, 4, 2, 0, 7],
            //                 [5, 14, 6, 17, 19, 9],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 191,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 3, 4, 2, 0, 7],
            //                 [5, 14, 6, 17, 19, 9],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 192,
            //             moving: 'Yellow',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 3, 4, 2, 0, 7],
            //                 [8, 14, 6, 17, 19, 9],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 193,
            //             moving: 'Red',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [16, 3, 4, 2, 0, 7],
            //                 [8, 14, 6, 17, 19, 9],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 194,
            //             moving: 'Yellow',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 3, 4, 2, 0, 7],
            //                 [8, 13, 6, 17, 19, 9],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 195,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [16, 3, 4, 5, 0, 7],
            //                 [8, 13, 6, 17, 19, 9],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 196,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [16, 3, 4, 5, 0, 7],
            //                 [15, 13, 6, 17, 19, 9],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 197,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [16, 3, 4, 5, 0, 14],
            //                 [15, 13, 6, 17, 19, 9],
            //             ],
            //             movingTo: 14,
            //             kill: [],
            //         },
            //         {
            //             step: 198,
            //             moving: 'Yellow',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 3, 4, 5, 0, 14],
            //                 [15, 12, 6, 17, 19, 9],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 199,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 1, 4, 5, 0, 14],
            //                 [15, 12, 6, 17, 19, 9],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 200,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [16, 1, 4, 5, 0, 14],
            //                 [15, 12, 10, 17, 19, 9],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 201,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [16, 1, 2, 5, 0, 14],
            //                 [15, 12, 10, 17, 19, 9],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 202,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [16, 1, 2, 5, 0, 14],
            //                 [15, 12, 10, 17, 21, 9],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 203,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [16, 1, 4, 5, 0, 14],
            //                 [15, 12, 10, 17, 21, 9],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 204,
            //             moving: 'Yellow',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [16, 1, 4, 5, 0, 14],
            //                 [15, 12, 6, 17, 21, 9],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 205,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 2, 4, 5, 0, 14],
            //                 [15, 12, 6, 17, 21, 9],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 206,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [16, 2, 4, 5, 0, 14],
            //                 [15, 12, 6, 17, 20, 9],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 207,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [16, 2, 4, 8, 0, 14],
            //                 [15, 12, 6, 17, 20, 9],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 208,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [16, 2, 4, 8, 0, 14],
            //                 [15, 12, 6, 17, 20, 5],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 209,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [16, 2, 3, 8, 0, 14],
            //                 [15, 12, 6, 17, 20, 5],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 210,
            //             moving: 'Yellow',
            //             movingBoardIndex: 15,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [16, 2, 3, 8, 0, 14],
            //                 [19, 12, 6, 17, 20, 5],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 211,
            //             moving: 'Red',
            //             movingBoardIndex: 14,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [16, 2, 3, 8, 0, 13],
            //                 [19, 12, 6, 17, 20, 5],
            //             ],
            //             movingTo: 13,
            //             kill: [],
            //         },
            //         {
            //             step: 212,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 2, 3, 8, 0, 13],
            //                 [19, 11, 6, 17, 20, 5],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 213,
            //             moving: 'Red',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [10, 2, 3, 8, 0, 13],
            //                 [19, 11, 6, 17, 20, 5],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 214,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 2, 3, 8, 0, 13],
            //                 [19, 11, 12, 17, 20, 5],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 215,
            //             moving: 'Red',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [10, 2, 3, 9, 0, 13],
            //                 [19, 11, 12, 17, 20, 5],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 216,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [10, 2, 3, 9, 0, 13],
            //                 [21, 11, 12, 17, 20, 5],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 217,
            //             moving: 'Red',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [10, 2, 3, 8, 0, 13],
            //                 [21, 11, 12, 17, 20, 5],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 218,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [10, 2, 3, 8, 0, 13],
            //                 [18, 11, 12, 17, 20, 5],
            //             ],
            //             movingTo: 18,
            //             kill: [],
            //         },
            //         {
            //             step: 219,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [10, 1, 3, 8, 0, 13],
            //                 [18, 11, 12, 17, 20, 5],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 220,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 3, 8, 0, 13],
            //                 [18, 11, 6, 17, 20, 5],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 221,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 4, 8, 0, 13],
            //                 [18, 11, 6, 17, 20, 5],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 222,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [10, 1, 4, 8, 0, 13],
            //                 [18, 16, 6, 17, 20, 5],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 223,
            //             moving: 'Red',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [10, 1, 4, 9, 0, 13],
            //                 [18, 16, 6, 17, 20, 5],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 224,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [10, 1, 4, 9, 0, 13],
            //                 [18, 16, 6, 17, 21, 5],
            //             ],
            //             movingTo: 21,
            //             kill: [],
            //         },
            //         {
            //             step: 225,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 3, 9, 0, 13],
            //                 [18, 16, 6, 17, 21, 5],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 226,
            //             moving: 'Yellow',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [10, 1, 3, 9, 0, 13],
            //                 [18, 11, 6, 17, 21, 5],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 227,
            //             moving: 'Red',
            //             movingBoardIndex: 3,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 7, 9, 0, 13],
            //                 [18, 11, 6, 17, 21, 5],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 228,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 7, 9, 0, 13],
            //                 [18, 11, 12, 17, 21, 5],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 229,
            //             moving: 'Red',
            //             movingBoardIndex: 7,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 3, 9, 0, 13],
            //                 [18, 11, 12, 17, 21, 5],
            //             ],
            //             movingTo: 3,
            //             kill: [],
            //         },
            //         {
            //             step: 230,
            //             moving: 'Yellow',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [10, 1, 3, 9, 0, 13],
            //                 [18, 11, 6, 17, 21, 5],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 231,
            //             moving: 'Red',
            //             movingBoardIndex: 10,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [16, 1, 3, 9, 0, 13],
            //                 [18, 11, 6, 17, 21, 5],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 232,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 2,
            //             currentBoard: [
            //                 [16, 1, 3, 9, 0, 13],
            //                 [18, 11, 10, 17, 21, 5],
            //             ],
            //             movingTo: 10,
            //             kill: [],
            //         },
            //         {
            //             step: 233,
            //             moving: 'Red',
            //             movingBoardIndex: 16,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 1, 3, 9, 0, 13],
            //                 [18, 11, 10, 17, 21, 5],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 234,
            //             moving: 'Yellow',
            //             movingBoardIndex: 17,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [12, 1, 3, 9, 0, 13],
            //                 [18, 11, 10, 20, 21, 5],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 235,
            //             moving: 'Red',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [6, 1, 3, 9, 0, 13],
            //                 [18, 11, 10, 20, 21, 5],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 236,
            //             moving: 'Yellow',
            //             movingBoardIndex: 20,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [6, 1, 3, 9, 0, 13],
            //                 [18, 11, 10, 17, 21, 5],
            //             ],
            //             movingTo: 17,
            //             kill: [],
            //         },
            //         {
            //             step: 237,
            //             moving: 'Red',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [6, 1, 3, 8, 0, 13],
            //                 [18, 11, 10, 17, 21, 5],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 238,
            //             moving: 'Yellow',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [6, 1, 3, 8, 0, 13],
            //                 [18, 11, 10, 17, 21, 9],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 239,
            //             moving: 'Red',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 1, 3, 8, 0, 13],
            //                 [18, 11, 10, 17, 21, 9],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 240,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 1, 3, 8, 0, 13],
            //                 [18, 6, 10, 17, 21, 9],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 241,
            //             moving: 'Red',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [12, 1, 3, 5, 0, 13],
            //                 [18, 6, 10, 17, 21, 9],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //         {
            //             step: 242,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 1, 3, 5, 0, 13],
            //                 [18, 6, 10, 17, 21, 8],
            //             ],
            //             movingTo: 8,
            //             kill: [],
            //         },
            //         {
            //             step: 243,
            //             moving: 'Red',
            //             movingBoardIndex: 13,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 1, 3, 5, 0, 7],
            //                 [18, 6, 10, 17, 21, 8],
            //             ],
            //             movingTo: 7,
            //             kill: [],
            //         },
            //         {
            //             step: 244,
            //             moving: 'Yellow',
            //             movingBoardIndex: 8,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [12, 1, 3, 5, 0, 7],
            //                 [18, 6, 10, 17, 21, 9],
            //             ],
            //             movingTo: 9,
            //             kill: [],
            //         },
            //         {
            //             step: 245,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 2, 3, 5, 0, 7],
            //                 [18, 6, 10, 17, 21, 9],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 246,
            //             moving: 'Yellow',
            //             movingBoardIndex: 21,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [12, 2, 3, 5, 0, 7],
            //                 [18, 6, 10, 17, 19, 9],
            //             ],
            //             movingTo: 19,
            //             kill: [],
            //         },
            //         {
            //             step: 247,
            //             moving: 'Red',
            //             movingBoardIndex: 2,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 1, 3, 5, 0, 7],
            //                 [18, 6, 10, 17, 19, 9],
            //             ],
            //             movingTo: 1,
            //             kill: [],
            //         },
            //         {
            //             step: 248,
            //             moving: 'Yellow',
            //             movingBoardIndex: 18,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [12, 1, 3, 5, 0, 7],
            //                 [20, 6, 10, 17, 19, 9],
            //             ],
            //             movingTo: 20,
            //             kill: [],
            //         },
            //         {
            //             step: 249,
            //             moving: 'Red',
            //             movingBoardIndex: 5,
            //             movingChessIndex: 3,
            //             currentBoard: [
            //                 [12, 1, 3, 2, 0, 7],
            //                 [20, 6, 10, 17, 19, 9],
            //             ],
            //             movingTo: 2,
            //             kill: [],
            //         },
            //         {
            //             step: 250,
            //             moving: 'Yellow',
            //             movingBoardIndex: 6,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [12, 1, 3, 2, 0, 7],
            //                 [20, 11, 10, 17, 19, 9],
            //             ],
            //             movingTo: 11,
            //             kill: [],
            //         },
            //         {
            //             step: 251,
            //             moving: 'Red',
            //             movingBoardIndex: 12,
            //             movingChessIndex: 0,
            //             currentBoard: [
            //                 [16, 1, 3, 2, 0, 7],
            //                 [20, 11, 10, 17, 19, 9],
            //             ],
            //             movingTo: 16,
            //             kill: [],
            //         },
            //         {
            //             step: 252,
            //             moving: 'Yellow',
            //             movingBoardIndex: 11,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 1, 3, 2, 0, 7],
            //                 [20, 12, 10, 17, 19, 9],
            //             ],
            //             movingTo: 12,
            //             kill: [],
            //         },
            //         {
            //             step: 253,
            //             moving: 'Red',
            //             movingBoardIndex: 1,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 4, 3, 2, 0, 7],
            //                 [20, 12, 10, 17, 19, 9],
            //             ],
            //             movingTo: 4,
            //             kill: [],
            //         },
            //         {
            //             step: 254,
            //             moving: 'Yellow',
            //             movingBoardIndex: 19,
            //             movingChessIndex: 4,
            //             currentBoard: [
            //                 [16, 4, 3, 2, 0, 7],
            //                 [20, 12, 10, 17, 15, 9],
            //             ],
            //             movingTo: 15,
            //             kill: [],
            //         },
            //         {
            //             step: 255,
            //             moving: 'Red',
            //             movingBoardIndex: 4,
            //             movingChessIndex: 1,
            //             currentBoard: [
            //                 [16, 6, 3, 2, 0, 7],
            //                 [20, 12, 10, 17, 15, 9],
            //             ],
            //             movingTo: 6,
            //             kill: [],
            //         },
            //         {
            //             step: 256,
            //             moving: 'Yellow',
            //             movingBoardIndex: 9,
            //             movingChessIndex: 5,
            //             currentBoard: [
            //                 [16, 6, 3, 2, 0, 7],
            //                 [20, 12, 10, 17, 15, 5],
            //             ],
            //             movingTo: 5,
            //             kill: [],
            //         },
            //     ],
            //     totalSteps: 256,
            //     win: 'Red',
            // };
            await fetchInsertBattleProcess(fetchBattleProcessDataResult, activityName, team1, team2);

            if (!notShow && team1 !== 'TBD' && team2 !== 'TBD' && team1 !== 'BYE' && team2 !== 'BYE') {
                //原本對戰結果為平手，所以詢問是否觀看新的過程
                if (oldScoreI == 0 && oldscoreII == 0) {
                    viewDetailOrShowResult(team1, team2, true);
                } else {
                    //原先沒有對戰過，所以詢問是否觀看新的過程
                    viewDetailOrShowResult(team1, team2, false);
                }
            }

            const scoreI = fetchBattleProcessDataResult.win === 'Red' ? 1 : 0;
            const scoreII = fetchBattleProcessDataResult.win === 'Yellow' ? 1 : 0;

            // update result of this round
            globalData['results'][round][match] = [
                scoreI > scoreII ? 1 : 0,
                scoreII > scoreI ? 1 : 0,
                { round: round, match: match },
            ];

            // initialize result of next round
            globalData['results'][round + 1][match / 2] = [, , { round: round + 1, match: match / 2 }];
            plot(globalData, false);
        } else if (isTeam1Upload || isTeam2Upload) {
            //兩組中有一組沒有上傳檔案
            if (isTeam1Upload) {
                alert(`${Team2} 棄權本場次，無對戰過程。`);
            } else {
                alert(`${Team1}棄權本場次，無對戰過程。`);
            }
            globalData['results'][round][match] = [
                fetchPythonCodeDataResultOfPlayerA ? 1 : 0,
                fetchPythonCodeDataResultOfPlayerB ? 1 : 0,
                { round: round, match: match },
            ];

            // initialize result of next round
            globalData['results'][round + 1][match / 2] = [, , { round: round + 1, match: match / 2 }];
            plot(globalData, false);
        } else {
            alert(`${team1},${team2} 未上傳程式碼，兩隊棄權本場次。`);
            document.getElementsByClassName('round')[round].getElementsByClassName('match')[
                match
            ].childNodes[0].childNodes[0].style.backgroundColor = 'red';
            document.getElementsByClassName('round')[round].getElementsByClassName('match')[
                match
            ].childNodes[0].childNodes[1].style.backgroundColor = 'red';

            globalData['results'][round][match] = [1, 0, { round: round, match: match }];

            if (match % 2 === 0) {
                globalData['results'][round + 1][match / 2] = [0, 1, { round: round + 1, match: match / 2 }];
            } else {
                globalData['results'][round + 1][match / 2] = [1, 0, { round: round + 1, match: match / 2 }];
            }

            plot(globalData, false);
        }
    }
};

// initialize next round match info
const resultsInit = (size, nextRound, finalRound = false) => {
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
};

const secondRound = () => {
    globalData['results'][1] = battleOfTheRest(globalData['size'], 1);
    globalData['results'][2] = resultsInit(globalData['size'], 2);
    plot(globalData);
    // document.getElementById('round1').disabled = true;
};

const thirdRound = () => {
    globalData['results'][2] = battleOfTheRest(globalData['size'], 2);
    globalData['results'][3] = resultsInit(globalData['size'], 3);
    plot(globalData);
    // document.getElementById('round2').disabled = true;
};

// const xRound = (round) => {
//     if (globalData['results'][round].length == 0) return; // ?
//     globalData['results'][round] = battleOfTheRest(globalData['size'], round);
//     globalData['results'][round + 1] = resultsInit(globalData['size'], round + 1);
//     plot(globalData);
//     document.getElementById('round' + round).disable = true;
// };

const forthRound = () => {
    globalData['results'][3] = battleOfTheRest(globalData['size'], 3);
    globalData['results'][4] = resultsInit(globalData['size'], 4);
    plot(globalData);
    // document.getElementById('round3').disable = true;
};

const fifthRound = () => {
    globalData['results'][4] = battleOfTheRest(globalData['size'], 4);
    globalData['results'][5] = resultsInit(globalData['size'], 5);
    plot(globalData);
};

const sixthRound = () => {
    globalData['results'][5] = battleOfTheRest(globalData['size'], 5);
    globalData['results'][6] = resultsInit(globalData['size'], 6);
    plot(globalData);
};

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
    noFileTeamsToRedAndSetRoundButtonDisabledOrNot();
};

const plot = async (data, edit = false) => {
    if (edit) {
        $(function () {
            const container = $('#team');
            container.bracket({
                init: data,
                disableToolbar: true,
                centerConnectors: true,
                skipConsolationRound: true,
                save: saveFn,
                teamWidth: 90,
                scoreWidth: 20,
                roundMargin: 40,
                matchMargin: 40,
            });
            noFileTeamsToRedAndSetRoundButtonDisabledOrNot();
        });
        await checkFileExists();
    } else {
        // onMatchClick can't impliment with edit mode (jQuery)
        $(function () {
            const container = $('#team');
            container.bracket({
                init: data,
                centerConnectors: true,
                onMatchClick: battleOfTwoTeam,
                skipConsolationRound: true,
                //onMatchHover
                teamWidth: 90,
                scoreWidth: 20,
                roundMargin: 40,
                matchMargin: 50,
            });
            noFileTeamsToRedAndSetRoundButtonDisabledOrNot();
        });
    }
};

const noFileTeamsToRedAndSetRoundButtonDisabledOrNot = () => {
    // no file teams need to be red
    let index = 0;
    for (let i = globalData['round']; i > 0; i--) {
        let includeTBD = false;
        let round = globalData['round'] - i;
        for (let j = 0; j < Math.pow(2, i); j++, index++) {
            // use index because of the following command will get 1-D array
            const teamName = document.getElementsByClassName('label')[index].innerText;

            if (noFileTeams[teamName]) {
                if (j % 2 === 0) {
                    document.getElementsByClassName('round')[round].getElementsByClassName('match')[
                        parseInt(j / 2)
                    ].childNodes[0].childNodes[0].style.color = 'red';
                } else {
                    document.getElementsByClassName('round')[round].getElementsByClassName('match')[
                        parseInt(j / 2)
                    ].childNodes[0].childNodes[1].style.color = 'red';
                }
            }
            // if there has TBD in Round,roundButton be false
            if (teamName === 'TBD') {
                includeTBD = true;
            }
        }
        if (!includeTBD) {
            document.getElementsByClassName('roundButton')[round].disabled = false;
        }
    }
};

const teamGenerate = async (totalTeamNum) => {
    globalData = dataGenerate(totalTeamNum);
    plot(globalData);

    const mappingButtonTitle = {
        0: '第一回合',
        1: '第二回合',
        2: '第三回合',
        3: '第四回合',
        4: '第五回合',
        5: '第六回合',
    };
    const mappingButtonFunction = {
        0: 'firstRound()',
        1: 'secondRound()',
        2: 'thirdRound()',
        3: 'forthRound()',
        4: 'fifthRound()',
        5: 'sixthRound()',
    };

    // 創造剩餘組別對戰的button;
    for (let i = 0; i < globalData['round']; i++) {
        const xRoundButton = document.createElement('button');
        xRoundButton.id = 'round' + i;
        xRoundButton.className = 'roundButton';
        xRoundButton.innerHTML = mappingButtonTitle[i];
        xRoundButton.setAttribute('onClick', mappingButtonFunction[i]);
        xRoundButton.setAttribute('disabled', true);
        document.getElementById('roundButtons').appendChild(xRoundButton);
    }
};

const checkFileExists = async () => {
    let powNum = globalData['round'];

    for (let i = 0; i < Math.pow(2, powNum); i++) {
        const teamName = document.getElementsByClassName('label')[i].innerText;
        if (teamName === 'BYE') {
            continue;
        }
        const checkPythonCode = await fetchPythonCode(teamName).then((response) => response);
        if (!checkPythonCode) {
            noFileTeams[teamName] = true;
        }
    }
};

//取得這個活動有幾組

window.onload = async () => {
    totalTeamNum = await fetchTotalTeamNum(activityName);
    teamGenerate(totalTeamNum);
    let powNum;
    // max round is six
    for (let i = 0; i <= 6; i++) {
        if (Math.pow(2, i) >= totalTeamNum) {
            powNum = Math.pow(2, i);
            break;
        }
    }

    await checkFileExists();
    noFileTeamsToRedAndSetRoundButtonDisabledOrNot();
};
