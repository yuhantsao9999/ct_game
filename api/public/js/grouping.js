// const urlParams = new URLSearchParams(window.location.search);
// const date = urlParams.get('date');

// //取得隊伍列表
// const getTeamList = () => {
//     return fetch('/api/findOrderByDate', {
//         method: 'post',
//         body: JSON.stringify({ date }),
//         headers: {
//             'content-type': 'application/json',
//         },
//     })
//         .then((response) => response.json())
//         .then((response) => {
//             // console.log('response', response);
//             response.forEach((item) => {
//                 delete item['_id'];
//             });
//             return response;
//         })
//         .catch((error) => console.error('Error:', error));
// };

// //TODO:這部分可以拿掉
// //呈現隊伍資料
// const display_team_code_id = (async () => {
//     const teamList = await getTeamList();
//     for (i = 0; i < teamList.length; i++) {
//         //替換隊伍名稱
//         if (teamList[i].classStartDate === date) {
//             const finishImg = document.createElement('img');
//             finishImg.src = './assets/image/check.png';
//             finishImg.className = 'finishIcon';

//             //TODO:需要加上輪詢
//             if (!teamList[i].originalname) {
//                 finishImg.style.display = 'none';
//             }
//             const teamDiv = document.createElement('div');
//             const teamLi = document.createElement('li');
//             const teamNameContent = document.createTextNode(teamList[i].teamName);

//             const originalNameContent = teamList[i].originalname
//                 ? document.createTextNode(teamList[i].originalname)
//                 : document.createTextNode('尚未上傳程式碼');
//             teamDiv.appendChild(teamNameContent);
//             teamDiv.appendChild(document.createElement('br'));
//             teamDiv.appendChild(finishImg);
//             teamDiv.appendChild(originalNameContent);

//             teamDiv.className = 'toggle';
//             teamLi.draggable = 'true';
//             teamLi.appendChild(teamDiv);
//             document.getElementById('items-list').appendChild(teamLi);
//         }
//     }
// })();

// //取得隊伍檔案名稱
// function search(nameValue, searchArray) {
//     for (var i = 0; i < searchArray.length; i++) {
//         if (searchArray[i].teamName === nameValue) {
//             return searchArray[i].originalname;
//         }
//     }
// }

// //進入西瓜棋對戰頁面
// // const battle = async () => {
// //     const teamList = await getTeamList();
// //     const playerA = document.getElementById('Player1').value;
// //     const playerB = document.getElementById('Player2').value;
// //     const data = {
// //         playerA: search(playerA, teamList),
// //         playerB: search(playerB, teamList),
// //     };
// //     return (window.location = `${window.location.origin}/watermelonChess?playerA=${playerA}&playerB=${playerB}`);
// //     //打黑盒子 api 接收資料並轉倒到西瓜棋頁面
// //     // fetch('#', {
// //     //     method: 'post',
// //     // })
// //     //     .then((response) => response.json())
// //     //     .then((response) => {
// //     //         console.log('response', response);
// //     //     })
// //     //     .catch((error) => console.error('Error:', error));
// // };

// //產生對戰表
// let globalData = {};

// const dataGenerate = (teamNum) => {
//     const data = {
//         teams: [],
//         results: [],
//         size: teamNum,
//         round: 1,
//     };
//     const randomTeam = getRandomTeam(teamNum);

//     console.log('randomTeam', randomTeam);

//     for (let i = 0; i < teamNum; i += 2) {
//         if (i + 1 == teamNum) {
//             data['teams'].push([randomTeam[i], null]);
//             break;
//         }
//         data['teams'].push([randomTeam[i], randomTeam[i + 1]]);
//     }
//     console.log('data', data);
//     return data;
// };

// const getRandomTeam = (teamNum) => {
//     const array = [];
//     for (let i = 0; i < teamNum; i++) {
//         array.push(`Team ${i + 1}`);
//     }

//     let currentIndex = array.length,
//         temporaryValue,
//         randomIndex;

//     // While there remain elements to shuffle...
//     while (0 !== currentIndex) {
//         // Pick a remaining element...
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex -= 1;

//         // And swap it with the current element.
//         temporaryValue = array[currentIndex];
//         array[currentIndex] = array[randomIndex];
//         array[randomIndex] = temporaryValue;
//     }

//     return array;
// };

// //對戰表對戰
// const firstBattle = () => {
//     //對戰表加入分數
//     const scoreArr = [];

//     for (let i = 0; i < globalData['size'] / globalData['round']; i += 2) {
//         scoreArr.push([getRandomInt(100), getRandomInt(100)]);
//         console.log('scoreArr', scoreArr);
//     }
//     console.log('before globalData', globalData);
//     globalData['results'].push(scoreArr);

//     console.log('after globalData', globalData);
//     plot(globalData);
// };

// // const secondBattle = () => {
// //     let globalData = {};
// //     //對戰表加入分數
// //     const scoreArr = [];
// //     for (let i = 0; i < globalData['size'] / globalData['round']; i += 2) {
// //         scoreArr.push([getRandomInt(100), getRandomInt(100)]);
// //     }
// //     globalData['results'].push(scoreArr);
// //     plot(globalData);
// //     for (let i = 0; i < globalData['size'] / globalData['round']; i += 2) {
// //         scoreArr.push([getRandomInt(100), getRandomInt(100)]);
// //     }
// //     console.log('battle globalData', globalData);
// // };

// const getRandomInt = (max) => {
//     return Math.floor(Math.random() * Math.floor(max));
// };

// const plot = (data) => {
//     $(function () {
//         const container = $('#team');
//         container.bracket({
//             init: data,
//             disableToolbar: true,
//             centerConnectors: true,
//             save: saveFn,
//         });
//     });
// };

// const saveFn = (data, userData) => {
//     globalData['teams'] = data['teams'];
// };

// const teamGenerate = () => {
//     const teamNum = document.getElementById('teamNum').value;
//     if (teamNum && Number(teamNum) > 1) {
//         globalData = dataGenerate(teamNum);
//         plot(globalData);
//         console.log('globalData', globalData);
//     } else {
//         alert('請輸入大於 1 的對戰組數');
//     }
// };

let globalData;

// data initialize
const dataGenerate = (teamNum) => {
    const data = {
        teams: [],
        results: [],
        size: teamNum,
        round: 1,
    };
    const randomTeam = getRandomTeam(teamNum);

    // round init
    for (let i = 0; Math.pow(2, i) <= 16; i++) {
        data['results'][i] = [];
    }

    // teams init
    for (let i = 0; i < teamNum; i += 2) {
        if (i + 1 == teamNum) {
            data['teams'].push([randomTeam[i], null]);
            break;
        }
        data['teams'].push([randomTeam[i], randomTeam[i + 1]]);

        // results init of first round
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
    const scoreArr = [];

    for (let i = 0; i < size / Math.pow(2, round); i += 2) {
        const hasBattled = Number.isInteger(globalData['results'][round][i / 2][0]);
        const scoreI = hasBattled ? globalData['results'][round][i / 2][0] : getRandomInt(100);
        const scoreII = hasBattled ? globalData['results'][round][i / 2][1] : getRandomInt(100);

        scoreArr.push([scoreI >= scoreII ? 1 : 0, scoreII >= scoreI ? 1 : 0, { round: round, match: i / 2 }]);
    }
    return scoreArr;
};

// simulate battle result from calling api
const battleOfTwoTeam = (data) => {
    const { round, match } = data;
    const scoreI = getRandomInt(100);
    const scoreII = getRandomInt(100);

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

// TODO : need auto generate the logic function of each round
const firstRound = () => {
    globalData['results'][0] = battleOfTheRest(globalData['size'], 0);
    globalData['results'][1] = resultsInit(globalData['size'], 1);
    globalData['results'][2] = [];
    plot(globalData);
    document.getElementById('first').disable = true;
};

const secondRound = () => {
    globalData['results'][1] = battleOfTheRest(globalData['size'], 1);
    globalData['results'][2] = resultsInit(globalData['size'], 2);
    plot(globalData);
    document.getElementById('second').disable = true;
};

const thirdRound = () => {
    globalData['results'][2] = battleOfTheRest(globalData['size'], 2);
    globalData['results'][3] = resultsInit(globalData['size'], 2); // set 2 because of the third place and the forth place
    plot(globalData);
    document.getElementById('third').disable = true;
};

const finalRound = () => {
    globalData['results'][3] = battleOfTheRest(globalData['size'], 2);
    plot(globalData);
    document.getElementById('final').disable = true;
};

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};

// edited mode
const setUp = () => {
    plot(globalData, true);
    document.getElementById('status').innerHTML = '編輯模式';
};

const setDown = () => {
    plot(globalData, false);
    document.getElementById('status').innerHTML = '對戰模式';
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
            });
        });
    }
};

const teamGenerate = (defaultTeamNum = 16) => {
    // const teamNum = document.getElementById('teamNum').value;
    globalData = dataGenerate(16);
    plot(globalData);
};

window.onload = () => {
    teamGenerate();
};
