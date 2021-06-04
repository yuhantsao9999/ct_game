const Red_CHESS = '/棋子-紅-';
const Yellow_CHESS = '/棋子-黃-';

export const side = {
    Red: 1,
    Yellow: 2,
};

export const chessIndex = {
    Red: [
        { index: 1, picture: `${Red_CHESS}01.png` },
        { index: 2, picture: `${Red_CHESS}02.png` },
        { index: 3, picture: `${Red_CHESS}03.png` },
        { index: 4, picture: `${Red_CHESS}04.png` },
        { index: 5, picture: `${Red_CHESS}05.png` },
        { index: 6, picture: `${Red_CHESS}06.png` },
    ],
    Yellow: [
        { index: 1, picture: `${Yellow_CHESS}01.png` },
        { index: 2, picture: `${Yellow_CHESS}02.png` },
        { index: 3, picture: `${Yellow_CHESS}03.png` },
        { index: 4, picture: `${Yellow_CHESS}04.png` },
        { index: 5, picture: `${Yellow_CHESS}05.png` },
        { index: 6, picture: `${Yellow_CHESS}06.png` },
    ],
};

// export const boardIndex = [
//     'S3',
//     'S2',
//     'S4',
//     'S1',
//     'W3',
//     'C3',
//     'E3',
//     'W2',
//     'W4',
//     'C2',
//     'C5',
//     'C4',
//     'E2',
//     'E4',
//     'W1',
//     'C1',
//     'E1',
//     'N3',
//     'N2',
//     'N4',
//     'N1',
// ];
export const boardIndex = {
    1: 'S3',
    2: 'S2',
    3: 'S4',
    4: 'S1',
    5: 'W3',
    6: 'C3',
    7: 'E3',
    8: 'W2',
    9: 'W4',
    10: 'C2',
    11: 'C5',
    12: 'C4',
    13: 'E2',
    14: 'E4',
    15: 'W1',
    16: 'C1',
    17: 'E1',
    18: 'N3',
    19: 'N2',
    20: 'N4',
    21: 'N1',
};
export const sibilingIndex = {
    S1: ['S2', 'S3', 'S4', 'C3'],
    S2: ['S1', 'S3', 'W3'],
    S3: ['S1', 'S2', 'S4'],
    S4: ['S1', 'S3', 'E3'],
    W1: ['N2', 'W4', 'W2'],
    W2: ['W1', 'W3', 'W4'],
    W3: ['W2', 'S2', 'W4'],
    W4: ['W1', 'W2', 'W3', 'C2'],
    C1: ['N3', 'C2', 'C5', 'C4'],
    C2: ['C1', 'W4', 'C3', 'C5'],
    C3: ['C5', 'C2', 'S1', 'C4'],
    C4: ['C1', 'C5', 'C3', 'E2'],
    C5: ['C1', 'C2', 'C3', 'C4'],
    E1: ['N4', 'E2', 'E4'],
    E2: ['C4', 'E3', 'E4', 'E1'],
    E3: ['E2', 'S4', 'E4'],
    E4: ['E1', 'E2', 'E3'],
    N1: ['N2', 'N3', 'N4'],
    N2: ['N1', 'N3', 'W1'],
    N3: ['N2', 'N1', 'N4', 'C1'],
    N4: ['N1', 'N3', 'E1'],
};
export const initData = [
    {
        from: {
            name: '',
            siblings: [],
            side: -1,
            picture: '',
        },
        to: {
            name: '',
            siblings: [],
            side: -1,
            picture: '',
        },
    },
];
export const dummyData = [
    {
        from: {
            name: 'E1',
            siblings: sibilingIndex['E1'],
            side: 1,
            picture: chessIndex.Yellow[5].picture,
        },
        to: {
            name: 'E4',
            siblings: sibilingIndex['E4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'S1',
            siblings: sibilingIndex['S1'],
            side: 0,
            picture: chessIndex.Red[1].picture,
        },
        to: {
            name: 'C3',
            siblings: sibilingIndex['C3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N3',
            siblings: sibilingIndex['N3'],
            side: 1,
            picture: chessIndex.Yellow[2].picture,
        },
        to: {
            name: 'C1',
            siblings: sibilingIndex['C1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C3',
            siblings: sibilingIndex['C3'],
            side: 0,
            picture: chessIndex.Red[1].picture,
        },
        to: {
            name: 'C5',
            siblings: sibilingIndex['C5'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: 1,
            picture: chessIndex.Yellow[4].picture,
        },
        to: {
            name: 'W4',
            siblings: sibilingIndex['W4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'E3',
            siblings: sibilingIndex['E3'],
            side: 0,
            picture: chessIndex.Red[5].picture,
        },
        to: {
            name: 'E2',
            siblings: sibilingIndex['E2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W4',
            siblings: sibilingIndex['W4'],
            side: 1,
            picture: chessIndex.Yellow[4].picture,
        },
        to: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W3',
            siblings: sibilingIndex['W3'],
            side: 0,
            picture: chessIndex.Red[0].picture,
        },
        to: {
            name: 'W4',
            siblings: sibilingIndex['W4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: 1,
            picture: chessIndex.Yellow[4].picture,
        },
        to: {
            name: 'W2',
            siblings: sibilingIndex['W2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'S2',
            siblings: sibilingIndex['S2'],
            side: 0,
            picture: chessIndex.Red[2].picture,
        },
        to: {
            name: 'W3',
            siblings: sibilingIndex['W3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N4',
            siblings: sibilingIndex['N4'],
            side: 1,
            picture: chessIndex.Yellow[3].picture,
        },
        to: {
            name: 'N3',
            siblings: sibilingIndex['N3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'S4',
            siblings: sibilingIndex['S4'],
            side: 0,
            picture: chessIndex.Red[4].picture,
        },
        to: {
            name: 'E3',
            siblings: sibilingIndex['E3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W2',
            siblings: sibilingIndex['W2'],
            side: 1,
            picture: chessIndex.Yellow[4].picture,
        },
        to: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'S3',
            siblings: sibilingIndex['S3'],
            side: 0,
            picture: chessIndex.Red[3].picture,
        },
        to: {
            name: 'S1',
            siblings: sibilingIndex['S1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: 1,
            picture: chessIndex.Yellow[4].picture,
        },
        to: {
            name: 'W2',
            siblings: sibilingIndex['W2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'S1',
            siblings: sibilingIndex['S1'],
            side: 0,
            picture: chessIndex.Red[3].picture,
        },
        to: {
            name: 'C3',
            siblings: sibilingIndex['C3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W2',
            siblings: sibilingIndex['W2'],
            side: 1,
            picture: chessIndex.Yellow[4].picture,
        },
        to: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C3',
            siblings: sibilingIndex['C3'],
            side: 0,
            picture: chessIndex.Red[3].picture,
        },
        to: {
            name: 'C4',
            siblings: sibilingIndex['C4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'E4',
            siblings: sibilingIndex['E4'],
            side: 1,
            picture: chessIndex.Yellow[5].picture,
        },
        to: {
            name: 'E1',
            siblings: sibilingIndex['E1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'E3',
            siblings: sibilingIndex['E3'],
            side: 0,
            picture: chessIndex.Red[4].picture,
        },
        to: {
            name: 'E4',
            siblings: sibilingIndex['E4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N1',
            siblings: sibilingIndex['N1'],
            side: 1,
            picture: chessIndex.Yellow[0].picture,
        },
        to: {
            name: 'N4',
            siblings: sibilingIndex['N4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C4',
            siblings: sibilingIndex['C4'],
            side: 0,
            picture: chessIndex.Red[3].picture,
        },
        to: {
            name: 'C3',
            siblings: sibilingIndex['C3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C1',
            siblings: sibilingIndex['C1'],
            side: 1,
            picture: chessIndex.Yellow[2].picture,
        },
        to: {
            name: 'C4',
            siblings: sibilingIndex['C4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C3',
            siblings: sibilingIndex['C3'],
            side: 0,
            picture: chessIndex.Red[3].picture,
        },
        to: {
            name: 'C2',
            siblings: sibilingIndex['C2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N3',
            siblings: sibilingIndex['N3'],
            side: 1,
            picture: chessIndex.Yellow[3].picture,
        },
        to: {
            name: 'N1',
            siblings: sibilingIndex['N1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C2',
            siblings: sibilingIndex['C2'],
            side: 0,
            picture: chessIndex.Red[3].picture,
        },
        to: {
            name: 'C3',
            siblings: sibilingIndex['C3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C4',
            siblings: sibilingIndex['C4'],
            side: 1,
            picture: chessIndex.Yellow[2].picture,
        },
        to: {
            name: 'C1',
            siblings: sibilingIndex['C1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C3',
            siblings: sibilingIndex['C3'],
            side: 0,
            picture: chessIndex.Red[3].picture,
        },
        to: {
            name: 'C2',
            siblings: sibilingIndex['C2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N2',
            siblings: sibilingIndex['N2'],
            side: 1,
            picture: chessIndex.Yellow[1].picture,
        },
        to: {
            name: 'N3',
            siblings: sibilingIndex['N3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'E2',
            siblings: sibilingIndex['E2'],
            side: 0,
            picture: chessIndex.Red[5].picture,
        },
        to: {
            name: 'C4',
            siblings: sibilingIndex['C4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'E1',
            siblings: sibilingIndex['E1'],
            side: 1,
            picture: chessIndex.Yellow[5].picture,
        },
        to: {
            name: 'E2',
            siblings: sibilingIndex['E2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'E4',
            siblings: sibilingIndex['E4'],
            side: 0,
            picture: chessIndex.Red[4].picture,
        },
        to: {
            name: 'E3',
            siblings: sibilingIndex['E3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'E2',
            siblings: sibilingIndex['E2'],
            side: 1,
            picture: chessIndex.Yellow[5].picture,
        },
        to: {
            name: 'E4',
            siblings: sibilingIndex['E4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C4',
            siblings: sibilingIndex['C4'],
            side: 0,
            picture: chessIndex.Red[5].picture,
        },
        to: {
            name: 'E2',
            siblings: sibilingIndex['E2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N3',
            siblings: sibilingIndex['N3'],
            side: 1,
            picture: chessIndex.Yellow[1].picture,
        },
        to: {
            name: 'N2',
            siblings: sibilingIndex['N2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C2',
            siblings: sibilingIndex['C2'],
            side: 0,
            picture: chessIndex.Red[3].picture,
        },
        to: {
            name: 'C3',
            siblings: sibilingIndex['C3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C1',
            siblings: sibilingIndex['C1'],
            side: 1,
            picture: chessIndex.Yellow[2].picture,
        },
        to: {
            name: 'C4',
            siblings: sibilingIndex['C4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W4',
            siblings: sibilingIndex['W4'],
            side: 0,
            picture: chessIndex.Red[0].picture,
        },
        to: {
            name: 'C2',
            siblings: sibilingIndex['C2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N4',
            siblings: sibilingIndex['N4'],
            side: 1,
            picture: chessIndex.Yellow[0].picture,
        },
        to: {
            name: 'E1',
            siblings: sibilingIndex['E1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C2',
            siblings: sibilingIndex['C2'],
            side: 0,
            picture: chessIndex.Red[0].picture,
        },
        to: {
            name: 'C1',
            siblings: sibilingIndex['C1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: 1,
            picture: chessIndex.Yellow[4].picture,
        },
        to: {
            name: 'W4',
            siblings: sibilingIndex['W4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C3',
            siblings: sibilingIndex['C3'],
            side: 0,
            picture: chessIndex.Red[3].picture,
        },
        to: {
            name: 'C2',
            siblings: sibilingIndex['C2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N1',
            siblings: sibilingIndex['N1'],
            side: 1,
            picture: chessIndex.Yellow[3].picture,
        },
        to: {
            name: 'N3',
            siblings: sibilingIndex['N3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C5',
            siblings: sibilingIndex['C5'],
            side: 0,
            picture: chessIndex.Red[1].picture,
        },
        to: {
            name: 'C4',
            siblings: sibilingIndex['C4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N3',
            siblings: sibilingIndex['N3'],
            side: 1,
            picture: chessIndex.Yellow[3].picture,
        },
        to: {
            name: 'N1',
            siblings: sibilingIndex['N1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C1',
            siblings: sibilingIndex['C1'],
            side: 0,
            picture: chessIndex.Red[0].picture,
        },
        to: {
            name: 'N3',
            siblings: sibilingIndex['N3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W4',
            siblings: sibilingIndex['W4'],
            side: 1,
            picture: chessIndex.Yellow[4].picture,
        },
        to: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C2',
            siblings: sibilingIndex['C2'],
            side: 0,
            picture: chessIndex.Red[3].picture,
        },
        to: {
            name: 'W4',
            siblings: sibilingIndex['W4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N1',
            siblings: sibilingIndex['N1'],
            side: 1,
            picture: chessIndex.Yellow[3].picture,
        },
        to: {
            name: 'N4',
            siblings: sibilingIndex['N4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C4',
            siblings: sibilingIndex['C4'],
            side: 0,
            picture: chessIndex.Red[1].picture,
        },
        to: {
            name: 'C1',
            siblings: sibilingIndex['C1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N4',
            siblings: sibilingIndex['N4'],
            side: 1,
            picture: chessIndex.Yellow[3].picture,
        },
        to: {
            name: 'N1',
            siblings: sibilingIndex['N1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N3',
            siblings: sibilingIndex['N3'],
            side: 0,
            picture: chessIndex.Red[0].picture,
        },
        to: {
            name: 'N4',
            siblings: sibilingIndex['N4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: 1,
            picture: chessIndex.Yellow[4].picture,
        },
        to: {
            name: 'W2',
            siblings: sibilingIndex['W2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C1',
            siblings: sibilingIndex['C1'],
            side: 0,
            picture: chessIndex.Red[1].picture,
        },
        to: {
            name: 'N3',
            siblings: sibilingIndex['N3'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N2',
            siblings: sibilingIndex['N2'],
            side: 1,
            picture: chessIndex.Yellow[1].picture,
        },
        to: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'E2',
            siblings: sibilingIndex['E2'],
            side: 0,
            picture: chessIndex.Red[5].picture,
        },
        to: {
            name: 'C4',
            siblings: sibilingIndex['C4'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: 1,
            picture: chessIndex.Yellow[1].picture,
        },
        to: {
            name: 'N2',
            siblings: sibilingIndex['N2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C4',
            siblings: sibilingIndex['C4'],
            side: 0,
            picture: chessIndex.Red[5].picture,
        },
        to: {
            name: 'C5',
            siblings: sibilingIndex['C5'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'N2',
            siblings: sibilingIndex['N2'],
            side: 1,
            picture: chessIndex.Yellow[1].picture,
        },
        to: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'C5',
            siblings: sibilingIndex['C5'],
            side: 0,
            picture: chessIndex.Red[5].picture,
        },
        to: {
            name: 'C1',
            siblings: sibilingIndex['C1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: 1,
            picture: chessIndex.Yellow[1].picture,
        },
        to: {
            name: 'N2',
            siblings: sibilingIndex['N2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'E3',
            siblings: sibilingIndex['E3'],
            side: 0,
            picture: chessIndex.Red[4].picture,
        },
        to: {
            name: 'E2',
            siblings: sibilingIndex['E2'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W2',
            siblings: sibilingIndex['W2'],
            side: 1,
            picture: chessIndex.Yellow[4].picture,
        },
        to: {
            name: 'W1',
            siblings: sibilingIndex['W1'],
            side: null,
            picture: null,
        },
    },
    {
        from: {
            name: 'W3',
            siblings: sibilingIndex['W3'],
            side: 0,
            picture: chessIndex.Red[2].picture,
        },
        to: {
            name: 'W2',
            siblings: sibilingIndex['W2'],
            side: null,
            picture: null,
        },
    },
];
