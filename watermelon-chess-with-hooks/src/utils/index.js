import { chessIndex } from '../constant/chessIndex';

//TODO: chessesDefault 圖片與 boardIndex 需要對應
export const chessesDefault = [
    {
        name: 'N1',
        siblings: ['N2', 'N3', 'N4'],
        side: 0,
        picture: chessIndex.Yellow[0].picture,
    },
    {
        name: 'N2',
        siblings: ['N1', 'N3', 'W1'],
        side: 0,
        picture: chessIndex.Yellow[1].picture,
    },
    {
        name: 'N3',
        siblings: ['N2', 'N1', 'N4', 'C1'],
        side: 0,
        picture: chessIndex.Yellow[3].picture,
    },
    {
        name: 'N4',
        siblings: ['N1', 'N3', 'E1'],
        side: 0,
        picture: chessIndex.Yellow[2].picture,
    },
    {
        name: 'W1',
        siblings: ['W2', 'W4', 'N2'],
        side: 0,
        picture: chessIndex.Yellow[4].picture,
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
        picture: chessIndex.Red[2].picture,
    },
    {
        name: 'E1',
        siblings: ['N4', 'E2', 'E4'],
        side: 0,
        picture: chessIndex.Yellow[5].picture,
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
 * 返回当前点击棋子的落子点
 * @param clickedChessData :当前点击的这个棋子
 * @param currentChesses : 当前棋子布局
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
 * 判断当前位置是不是一个落子点
 * @param chessData : 当前位置
 * @param ableReceive : 所有的落子点组成的数组
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
 * 返回这个棋子相对于 board 的位置（top和left的值）
 * @param chessName : 棋子名称
 * @param a : 五个小圆的半径
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
 * 将点击的落子点变为新的颜色（side），返回更新后的棋子布局
 * @param newChesses : 当前棋子布局
 * @param clickedAbleReceive : 点击的落子点
 * @param newside : 新的颜色(新的side)
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
 * 返回当前棋子布局中，searchSide这一方被吃掉的棋子的名称组成的数组
 * @param chesses : 当前棋子布局
 * @param searchSide : 要查找的被吃掉的这一方棋子的side
 */
export function findBeEatenChesses(chesses, searchSide) {
    let beEatenChesses = []; // 所有被吃掉的棋子的名称组成的数组
    let searchSideChesses = getAllSearchSideChesses(chesses, searchSide); // 这一方所有的棋子

    // 1、先判断单独的棋子被对方吃掉的情况
    for (let i = 0; i < searchSideChesses.length; i++) {
        // 如果这颗棋子所有相邻的棋子都是对方的棋子，则这颗棋子被吃掉
        if (allSiblingsAreOtherSide(chesses, searchSideChesses[i])) {
            beEatenChesses.push(searchSideChesses[i].name);
        }
    }
    // 2、找本方的棋子两个及以上连在一起的所有组合
    let combinations = getAllCombinationOfSearchSide(chesses, searchSide);
    for (let cbn of combinations) {
        if (allSurroundSiblingsOfThisCbnAreOtherSide(chesses, cbn, searchSide)) {
            // 这个组合周围的棋子都是对方的棋子，这个组合将被吃掉
            beEatenChesses = beEatenChesses.concat(cbn);
        }
    }

    return beEatenChesses;
}

/**
 * 判断当前棋子布局下，cbn 这个组合是否被吃掉（即这个组合的周围是否都是对方的棋子）
 * @param chesses : 当前棋子布局
 * @param cbn : 一个组合
 * @param searchSide : 要查找的被吃掉的这一方棋子的side
 */
function allSurroundSiblingsOfThisCbnAreOtherSide(chesses, cbn, searchSide) {
    let surround = getSurroundSiblingsOfThisCbn(chesses, cbn);
    let otherSide = searchSide === 0 ? 1 : 0;
    let allSurroundAreOtherSide = true; // 假设周围的位置都是对方的棋子

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
 * 返回 当前棋子布局 下，当前组合的所有周围的位置的名称 组成的数组
 * @param chesses : 当前棋子布局
 * @param cbn : 当前组合
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

    surround = [...new Set(surround)]; // 数组去重
    return surround;
}

export function getAllCombinationOfSearchSide(chesses, searchSide) {
    let combinations = []; // searchSide这一方的棋子，两个及以上连在一起的所有组合
    let searchSideChesses = getAllSearchSideChesses(chesses, searchSide); // 这一方所有的棋子

    for (let i = 0; i < searchSideChesses.length; i++) {
        let cbn = getCombinationOfThisChess(chesses, searchSideChesses[i]); // 得到从当前棋子出发找到的本方棋子连在一起的组合
        if (cbn.length > 1 && !combinationsIncludeThisCbn(combinations, cbn)) {
            combinations.push(cbn);
        }
    }

    return combinations;
}

/**
 * 判断 combinations 中是否有 cbn 这个组合，如果包含，返回 true
 * @param combinations
 * @param cbn
 */
function combinationsIncludeThisCbn(combinations, cbn) {
    let includes = false; // 假定 combinations 中不包含 cbn 这个组合
    for (let cbnItem of combinations) {
        if (cbnItem.length === cbn.length) {
            let theSame = true; // 先假定 cbnItem 和 cbn 这两个组合完全一样
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

// 得到从当前棋子出发找到的本方棋子连在一起的组合
export function getCombinationOfThisChess(chesses, chessData) {
    let together = [chessData.name];
    f(chesses, chessData.name, together);
    return together;
}

function f(chesses, chessDataName, together) {
    let siblings = getOwnSideSiblingsName(chesses, chessDataName); // 找到当前棋子的所有本方相邻棋子
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
 * 返回要查询的这个棋子的 所有本方相邻棋子
 * @param chesses : 当前棋子布局
 * @param thisChessName : 要查询的这颗棋子的名称
 */
export function getOwnSideSiblingsName(chesses, thisChessName) {
    let ownSideSiblingsName = [];
    let thisChess = null;
    for (let i = 0; i < chesses.length; i++) {
        if (chesses[i].name === thisChessName) {
            thisChess = chesses[i];
        }
    }

    let siblings = thisChess.siblings; //当前棋子的所有相鄰棋子
    for (let siblingName of siblings) {
        for (let i = 0; i < chesses.length; i++) {
            if (chesses[i].name === siblingName) {
                // 找到相鄰棋子
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
 * 返回当前棋子布局中，颜色为当前要查询的颜色的所有棋子
 * @param chesses : 当前棋子布局
 * @param searchSide : 要查询的颜色
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
 * 判断当前这颗棋子的所有相邻的位置是否都是对方的棋子，如果都是对方的棋子，返回 true
 * @param chesses : 当前棋子布局
 * @param oneChess : 要查询的这颗棋子位置
 * @returns {boolean}
 */
export function allSiblingsAreOtherSide(chesses, oneChess) {
    let siblingsAreOtherSide = true; // 假设这个棋子所有相邻的位置都是对方的棋子
    let thisChessSiblings = oneChess.siblings; // 所有相邻的位置的名称
    for (let siblingName of thisChessSiblings) {
        for (let i = 0; i < chesses.length; i++) {
            if (chesses[i].name === siblingName) {
                // 找到这颗相邻的棋子的位置
                if (
                    chesses[i].side === null || // 这个相邻位置上是空的
                    chesses[i].side === oneChess.side
                ) {
                    // 或者是自己这一方的棋子
                    siblingsAreOtherSide = false;
                    return siblingsAreOtherSide;
                }
            }
        }
    }
    return siblingsAreOtherSide;
}
