const getChessProcessData = [
    {
        form: {
            name: 'S1',
            siblings: ['S2', 'S3', 'S4', 'C3'],
            side: 1,
            picture: chessIndex.yellow[1].picture,
        },
        to: { name: 'C3', siblings: ['C5', 'C2', 'S1', 'C4'], side: null, picture: null },
    },
    {
        form: {
            name: 'E3',
            siblings: ['E2', 'S4', 'E4'],
            side: 1,
            picture: chessIndex.yellow[5].picture,
        },
        to: { name: 'W2', siblings: ['W1', 'W3', 'W4'], side: null, picture: null },
    },
];

export default getChessProcessData;
