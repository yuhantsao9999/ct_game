const { chessIndex, boardIndex, sibilingIndex, side } = require('../constant/chessIndex');

export const matchBattleProcessData = (process) => {
    const chessProcessData = [];
    console.log('process', process);

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
