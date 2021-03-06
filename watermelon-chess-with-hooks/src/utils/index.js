import { chessIndex } from '../constant/chessIndex';

export const chessesDefault = [
    {
        name: 'N1',
        siblings: ['N2', 'N3', 'N4'],
        side: 0,
        picture: chessIndex.Yellow[5].picture,
    },
    {
        name: 'N2',
        siblings: ['N1', 'N3', 'W1'],
        side: 0,
        picture: chessIndex.Yellow[3].picture,
    },
    {
        name: 'N3',
        siblings: ['N2', 'N1', 'N4', 'C1'],
        side: 0,
        picture: chessIndex.Yellow[2].picture,
    },
    {
        name: 'N4',
        siblings: ['N1', 'N3', 'E1'],
        side: 0,
        picture: chessIndex.Yellow[4].picture,
    },
    {
        name: 'W1',
        siblings: ['W2', 'W4', 'N2'],
        side: 0,
        picture: chessIndex.Yellow[0].picture,
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
        side: 1,
        picture: chessIndex.Red[4].picture,
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
        side: 1,
        picture: chessIndex.Red[3].picture,
    },
    {
        name: 'S2',
        siblings: ['W3', 'S3', 'S1'],
        side: 1,
        picture: chessIndex.Red[1].picture,
    },
    {
        name: 'S3',
        siblings: ['S1', 'S2', 'S4'],
        side: 1,
        picture: chessIndex.Red[0].picture,
    },
    {
        name: 'S4',
        siblings: ['S1', 'S3', 'E3'],
        side: 1,
        picture: chessIndex.Red[4].picture,
    },
    {
        name: 'E1',
        siblings: ['N4', 'E2', 'E4'],
        side: 0,
        picture: chessIndex.Yellow[1].picture,
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
        side: 1,
        picture: chessIndex.Red[5].picture,
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

/**
 * ????????????????????????????????????
 * @param clickedChessData :???????????????????????????
 * @param currentChesses : ??????????????????
 * @returns {[]}
 */
export function getAbleReceive(clickedChessData, currentChesses) {
    let siblings = clickedChessData.siblings;
    let ableReceive = [];
    for (let i = 0; i < siblings.length; i++) {
        for (let j = 0; j < currentChesses.length; j++) {
            if (currentChesses[j].name === siblings[i]) {
                if (currentChesses[j].side === null) {
                    ableReceive.push(currentChesses[j]);
                }
            }
        }
    }
    return ableReceive;
}

/**
 * ??????????????????????????????????????????
 * @param chessData : ????????????
 * @param ableReceive : ?????????????????????????????????
 * @returns {boolean}
 */
export function isOneOfAbleReceive(chessData, ableReceive) {
    let isAbleReceive = false;
    for (let i = 0; i < ableReceive.length; i++) {
        if (ableReceive[i].name === chessData.name) {
            isAbleReceive = true;
            break;
        }
    }
    return isAbleReceive;
}

/**
 * ??????????????????????????? board ????????????top???left?????????
 * @param chessName : ????????????
 * @param a : ?????????????????????
 * @returns {{top: number, left: number}}
 */
export function getChessPosition(chessName, a) {
    let top,
        left = 0;
    if (chessName === 'N1') {
        top = 0;
        left = 3 * a;
    } else if (chessName === 'N2') {
        top = a / 12;
        left = 3 * a - 0.9965 * a;
    } else if (chessName === 'N3') {
        top = a;
        left = 3 * a;
    } else if (chessName === 'N4') {
        top = a / 12;
        left = 3 * a + 0.9965 * a;
    } else if (chessName === 'W1') {
        top = 3 * a - 0.9965 * a;
        left = a / 12;
    } else if (chessName === 'W2') {
        top = 3 * a;
        left = 0;
    } else if (chessName === 'W3') {
        top = 3 * a + 0.9965 * a;
        left = a / 12;
    } else if (chessName === 'W4') {
        top = 3 * a;
        left = a;
    } else if (chessName === 'S1') {
        top = 5 * a;
        left = 3 * a;
    } else if (chessName === 'S2') {
        top = 6 * a - a / 12;
        left = 3 * a - 0.9965 * a;
    } else if (chessName === 'S3') {
        top = 6 * a;
        left = 3 * a;
    } else if (chessName === 'S4') {
        top = 6 * a - a / 12;
        left = 3 * a + 0.9965 * a;
    } else if (chessName === 'E1') {
        top = 3 * a - 0.9965 * a;
        left = 6 * a - a / 12;
    } else if (chessName === 'E2') {
        top = 3 * a;
        left = 5 * a;
    } else if (chessName === 'E3') {
        top = 3 * a + 0.9965 * a;
        left = 6 * a - a / 12;
    } else if (chessName === 'E4') {
        top = 3 * a;
        left = 6 * a;
    } else if (chessName === 'C1') {
        top = 3 * a - 0.9965 * a;
        left = 3 * a;
    } else if (chessName === 'C2') {
        top = 3 * a;
        left = 3 * a - 0.9965 * a;
    } else if (chessName === 'C3') {
        top = 3 * a + 0.9965 * a;
        left = 3 * a;
    } else if (chessName === 'C4') {
        top = 3 * a;
        left = 3 * a + 0.9965 * a;
    } else if (chessName === 'C5') {
        top = 3 * a;
        left = 3 * a;
    }

    return {
        top,
        left,
    };
}

/**
 * ??????????????????????????????????????????side????????????????????????????????????
 * @param newChesses : ??????????????????
 * @param clickedAbleReceive : ??????????????????
 * @param newside : ????????????(??????side)
 * @returns {*}
 */
export function getNewChesses(newChesses, clickedAbleReceive, newside, newPicture) {
    for (let i = 0; i < newChesses.length; i++) {
        if (newChesses[i].name === clickedAbleReceive.name) {
            newChesses[i].side = newside;
            newChesses[i].picture = newPicture;
            return newChesses;
        }
    }
}

/**
 * ??????????????????????????????searchSide???????????????????????????????????????????????????
 * @param chesses : ??????????????????
 * @param searchSide : ??????????????????????????????????????????side
 */
export function findBeEatenChesses(chesses, searchSide) {
    let beEatenChesses = []; // ????????????????????????????????????????????????
    let searchSideChesses = getAllSearchSideChesses(chesses, searchSide); // ????????????????????????

    // 1???????????????????????????????????????????????????
    for (let i = 0; i < searchSideChesses.length; i++) {
        // ???????????????????????????????????????????????????????????????????????????????????????
        if (allSiblingsAreOtherSide(chesses, searchSideChesses[i])) {
            beEatenChesses.push(searchSideChesses[i].name);
        }
    }
    // 2???????????????????????????????????????????????????????????????
    let combinations = getAllCombinationOfSearchSide(chesses, searchSide);
    for (let cbn of combinations) {
        if (allSurroundSiblingsOfThisCbnAreOtherSide(chesses, cbn, searchSide)) {
            // ???????????????????????????????????????????????????????????????????????????
            beEatenChesses = beEatenChesses.concat(cbn);
        }
    }

    return beEatenChesses;
}

/**
 * ??????????????????????????????cbn ????????????????????????????????????????????????????????????????????????????????????
 * @param chesses : ??????????????????
 * @param cbn : ????????????
 * @param searchSide : ??????????????????????????????????????????side
 */
function allSurroundSiblingsOfThisCbnAreOtherSide(chesses, cbn, searchSide) {
    let surround = getSurroundSiblingsOfThisCbn(chesses, cbn);
    let otherSide = searchSide === 0 ? 1 : 0;
    let allSurroundAreOtherSide = true; // ??????????????????????????????????????????

    for (let surroundItemName of surround) {
        for (let i = 0; i < chesses.length; i++) {
            if (chesses[i].name === surroundItemName) {
                if (chesses[i].side !== otherSide) {
                    allSurroundAreOtherSide = false;
                    return allSurroundAreOtherSide;
                }
                break;
            }
        }
    }
    return allSurroundAreOtherSide;
}

/**
 * ?????? ?????????????????? ??????????????????????????????????????????????????? ???????????????
 * @param chesses : ??????????????????
 * @param cbn : ????????????
 */
function getSurroundSiblingsOfThisCbn(chesses, cbn) {
    let surround = [];
    for (let itemName of cbn) {
        for (let i = 0; i < chesses.length; i++) {
            if (chesses[i].name === itemName) {
                let siblings = chesses[i].siblings;
                for (let siblingItem of siblings) {
                    if (!cbn.includes(siblingItem)) {
                        surround.push(siblingItem);
                    }
                }
            }
        }
    }

    surround = [...new Set(surround)]; // ????????????
    return surround;
}

export function getAllCombinationOfSearchSide(chesses, searchSide) {
    let combinations = []; // searchSide???????????????????????????????????????????????????????????????
    let searchSideChesses = getAllSearchSideChesses(chesses, searchSide); // ????????????????????????

    for (let i = 0; i < searchSideChesses.length; i++) {
        let cbn = getCombinationOfThisChess(chesses, searchSideChesses[i]); // ?????????????????????????????????????????????????????????????????????
        if (cbn.length > 1 && !combinationsIncludeThisCbn(combinations, cbn)) {
            combinations.push(cbn);
        }
    }

    return combinations;
}

/**
 * ?????? combinations ???????????? cbn ???????????????????????????????????? true
 * @param combinations
 * @param cbn
 */
function combinationsIncludeThisCbn(combinations, cbn) {
    let includes = false; // ?????? combinations ???????????? cbn ????????????
    for (let cbnItem of combinations) {
        if (cbnItem.length === cbn.length) {
            let theSame = true; // ????????? cbnItem ??? cbn ???????????????????????????
            for (let i = 0; i < cbnItem.length; i++) {
                if (!cbn.includes(cbnItem[i])) {
                    theSame = false;
                    break;
                }
            }
            if (theSame) {
                includes = true;
                break;
            }
        }
    }

    return includes;
}

// ?????????????????????????????????????????????????????????????????????
export function getCombinationOfThisChess(chesses, chessData) {
    let together = [chessData.name];
    f(chesses, chessData.name, together);
    return together;
}

function f(chesses, chessDataName, together) {
    let siblings = getOwnSideSiblingsName(chesses, chessDataName); // ?????????????????????????????????????????????
    if (siblings.length > 0) {
        for (let siblingName of siblings) {
            if (!together.includes(siblingName)) {
                together.push(siblingName);
                f(chesses, siblingName, together);
            }
        }
    }
}

/**
 * ????????????????????????????????? ????????????????????????
 * @param chesses : ??????????????????
 * @param thisChessName : ?????????????????????????????????
 */
export function getOwnSideSiblingsName(chesses, thisChessName) {
    let ownSideSiblingsName = [];
    let thisChess = null;
    for (let i = 0; i < chesses.length; i++) {
        if (chesses[i].name === thisChessName) {
            thisChess = chesses[i];
        }
    }

    let siblings = thisChess.siblings; //?????????????????????????????????
    for (let siblingName of siblings) {
        for (let i = 0; i < chesses.length; i++) {
            if (chesses[i].name === siblingName) {
                // ??????????????????
                if (chesses[i].side === thisChess.side) {
                    ownSideSiblingsName.push(chesses[i].name);
                }
                break;
            }
        }
    }

    return ownSideSiblingsName;
}

/**
 * ??????????????????????????????????????????????????????????????????????????????
 * @param chesses : ??????????????????
 * @param searchSide : ??????????????????
 * @returns {[]}
 */
export function getAllSearchSideChesses(chesses, searchSide) {
    let searchSideChesses = [];
    for (let i = 0; i < chesses.length; i++) {
        if (chesses[i].side === searchSide) {
            searchSideChesses.push(chesses[i]);
        }
    }
    return searchSideChesses;
}

/**
 * ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????? true
 * @param chesses : ??????????????????
 * @param oneChess : ??????????????????????????????
 * @returns {boolean}
 */
export function allSiblingsAreOtherSide(chesses, oneChess) {
    let siblingsAreOtherSide = true; // ????????????????????????????????????????????????????????????
    let thisChessSiblings = oneChess.siblings; // ??????????????????????????????
    for (let siblingName of thisChessSiblings) {
        for (let i = 0; i < chesses.length; i++) {
            if (chesses[i].name === siblingName) {
                // ????????????????????????????????????
                if (
                    chesses[i].side === null || // ??????????????????????????????
                    chesses[i].side === oneChess.side
                ) {
                    // ?????????????????????????????????
                    siblingsAreOtherSide = false;
                    return siblingsAreOtherSide;
                }
            }
        }
    }
    return siblingsAreOtherSide;
}
