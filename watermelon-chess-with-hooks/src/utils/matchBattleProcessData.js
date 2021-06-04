const { chessIndex, boardIndex, sibilingIndex, side } = require('../constant/chessIndex');

const matchBattleProcessData = (process) => {
    const chessProcessData = [];
    for (let i = 0; i < process.length; i++) {
        const data = {
            from: {
                name: boardIndex[process[i].movingBoardIndex], //'E1'
                siblings: sibilingIndex[boardIndex[process[i].movingBoardIndex]], //sibilingIndex['E1'],
                side: side[process[i].moving], //1,
                picture: chessIndex[process[i].moving][process[i].movingChessIndex].picture, //chessIndex.Yellow[5].picture,
            },
            to: {
                name: boardIndex[process[i].movingTo], //'E4',
                siblings: sibilingIndex[boardIndex[process[i].movingTo]],
                side: null,
                picture: null,
            },
        };
        chessProcessData.push(data);
    }
    return chessProcessData;
};

export default matchBattleProcessData;

// const process = [
//     {
//         step: 1,
//         moving: 'Red',
//         movingBoardIndex: 4,
//         movingTo: 6,
//         movingChessIndex: 3,
//         kill: [],
//     },
//     {
//         step: 2,
//         moving: 'Yellow',
//         movingBoardIndex: 17,
//         movingTo: 13,
//         movingChessIndex: 1,
//         kill: [],
//     },
//     {
//         step: 3,
//         moving: 'Red',
//         movingBoardIndex: 5,
//         movingTo: 8,
//         movingChessIndex: 4,
//         kill: [],
//     },
// ];
