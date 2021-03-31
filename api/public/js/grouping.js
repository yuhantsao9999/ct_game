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

const viewBattle = (team1, team2) => {
    // TODO : ask the user whether to view battle or not 
    if (confirm('Want to view battle detail ?')) {
        window.open(`http://localhost:3080/watermelonChess?playerA=${team1}&playerB=${team2}`);
    } else {
        return
    }
}

const addContextMentu = () => {
    teamContainerArr = document.getElementsByClassName("teamContainer")
    for (teamContainer of teamContainerArr) {
        teamContainer.addEventListener('contextmenu', function (e) {
            let teamArr = []
            let scoreArr = []
            for (team of this.getElementsByClassName("team")) {
                for (label of team.getElementsByClassName("label")) {
                    teamArr.push(label.innerHTML)
                }
                for (score of team.getElementsByClassName("score")) {
                    scoreArr.push(score.innerHTML)
                }
            }
            if (scoreArr[0] == "--" || scoreArr[1] == "--") {
                window.alert("Can't view battle if a team has no score.")
                e.preventDefault();
                return
            }
            viewBattle(teamArr[0], teamArr[1])
            e.preventDefault();
        }, true);
    }
}

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
                teamWidth: 95,
                scoreWidth: 20,
                roundMargin: 20,
                matchMargin: 10,
            });
        });
    }
    addContextMentu()
};

const teamGenerate = (defaultTeamNum = 16) => {
    globalData = dataGenerate(16);
    plot(globalData);
};

window.onload = () => {
    teamGenerate();
};
