const { chessIndex, boardIndex, sibilingIndex, side } = require('../constant/chessIndex');
export const matchCurrentBoardChessStatus = (index, currentBoard) => {
    const chessStatusData = [
        {
            name: 'N1',
            siblings: ['N2', 'N3', 'N4'],
            side: null,
            picture: null,
        },
        {
            name: 'N2',
            siblings: ['N1', 'N3', 'W1'],
            side: null,
            picture: null,
        },
        {
            name: 'N3',
            siblings: ['N2', 'N1', 'N4', 'C1'],
            side: null,
            picture: null,
        },
        {
            name: 'N4',
            siblings: ['N1', 'N3', 'E1'],
            side: null,
            picture: null,
        },
        {
            name: 'W1',
            siblings: ['W2', 'W4', 'N2'],
            side: null,
            picture: null,
        },
        {
            name: 'W2',
            siblings: ['W1', 'W3', 'W4'],
            side: null,
            picture: null,
        },
        {
            name: 'W3',
            siblings: ['W2', 'S2', 'W4'],
            side: null,
            picture: null,
        },
        {
            name: 'W4',
            siblings: ['W1', 'W2', 'W3', 'C2'],
            side: null,
            picture: null,
        },
        {
            name: 'S1',
            siblings: ['S2', 'S3', 'S4', 'C3'],
            side: null,
            picture: null,
        },
        {
            name: 'S2',
            siblings: ['W3', 'S3', 'S1'],
            side: null,
            picture: null,
        },
        {
            name: 'S3',
            siblings: ['S1', 'S2', 'S4'],
            side: null,
            picture: null,
        },
        {
            name: 'S4',
            siblings: ['S1', 'S3', 'E3'],
            side: null,
            picture: null,
        },
        {
            name: 'E1',
            siblings: ['N4', 'E2', 'E4'],
            side: null,
            picture: null,
        },
        {
            name: 'E2',
            siblings: ['C4', 'E3', 'E4', 'E1'],
            side: null,
            picture: null,
        },
        {
            name: 'E3',
            siblings: ['E2', 'S4', 'E4'],
            side: null,
            picture: null,
        },
        {
            name: 'E4',
            siblings: ['E1', 'E2', 'E3'],
            side: null,
            picture: null,
        },
        {
            name: 'C1',
            siblings: ['N3', 'C2', 'C5', 'C4'],
            side: null,
            picture: null,
        },
        {
            name: 'C2',
            siblings: ['C1', 'W4', 'C3', 'C5'],
            side: null,
            picture: null,
        },
        {
            name: 'C3',
            siblings: ['C5', 'C2', 'S1', 'C4'],
            side: null,
            picture: null,
        },
        {
            name: 'C4',
            siblings: ['C1', 'C5', 'C3', 'E2'],
            side: null,
            picture: null,
        },
        {
            name: 'C5',
            siblings: ['C1', 'C2', 'C3', 'C4'],
            side: null,
            picture: null,
        },
    ];
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 6; j++) {
            const sideColor = i === 0 ? 'Red' : 'Yellow';
            const sideNumber = i === 0 ? 1 : 0;
            const picture = chessIndex[sideColor][j].picture;
            for (let k = 0; k < 21; k++) {
                if (chessStatusData[k].name == boardIndex[currentBoard[i][j]]) {
                    chessStatusData[k].side = sideNumber;
                    chessStatusData[k].picture = picture;
                }
            }
        }
    }
    // console.log('matched chessStatusData', index, chessStatusData);
    return chessStatusData;
};
export const matchBattleProcessData = (process) => {
    const chessProcessData = [];

    if (process.length !== 0) {
        for (let i = 0; i < process.length; i++) {
            // console.log('whatcolor 第', i, '個', chessIndex[process[i].moving][process[i].movingChessIndex]);
            const data = {
                from: {
                    name: boardIndex[process[i].movingBoardIndex], //'E1'
                    siblings: sibilingIndex[boardIndex[process[i].movingBoardIndex]], //sibilingIndex['E1'],
                    side: side[process[i].moving], //0,
                    picture: chessIndex[process[i].moving][process[i].movingChessIndex].picture, //chessIndex.Yellow[5].picture,
                },
                to: {
                    name: boardIndex[process[i].movingTo], //'E4',
                    siblings: sibilingIndex[boardIndex[process[i].movingTo]],
                    side: null,
                    picture: null,
                },
                kill: process[i].kill,
                currentBoard: matchCurrentBoardChessStatus(i, process[i].currentBoard),
            };
            chessProcessData.push(data);
        }
    }

    return chessProcessData;
};

export const matchBoardIndex = (boardNumber) => {
    if (boardNumber) {
        boardNumber.forEach(function (value, index, array) {
            array[index] = boardIndex[value];
        });
        return boardNumber;
    } else {
        return [];
    }
};

//處理獲勝方的狀況 Red: 0,Yellow: 1 ,平手:-1
export const mappingWinnerIndex = (battleData, playerA, playerB) => {
    switch (battleData.winner) {
        case playerA:
            return 0;
        case playerB:
            return 1;
        default:
            return -1;
    }
};
