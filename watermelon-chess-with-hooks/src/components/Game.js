import React, { useState, useContext, useEffect } from 'react';
import Board from './Board';
import TeamList from './TeamList';
import { dummyData } from '../constant/chessIndex';
import { chessesDefault, findBeEatenChesses, getAbleReceive, getNewChesses, isOneOfAbleReceive } from '../utils';
import _ from 'lodash';
import { ContextStore } from './Container';
import Slider from './Slider';

function Game() {
    const { red, setRed, yellow, setYellow } = useContext(ContextStore);
    let boardWidth = document.documentElement.clientWidth * 0.45;
    let r = 0.0463 * boardWidth; // 棋子的半径
    let a = (0.5 * boardWidth - r) / 3; // 五个小圆的半径

    let [clickedChess, setClickedChess] = useState(null); // 当前点击的棋子
    let [ableReceive, setAbleReceive] = useState([]); // 落子点

    let sides = [0, 1]; // 對戰雙方
    let [winnerSide, setWinnerSide] = useState(null); // 獲勝方

    let [history, setHistory] = useState([
        {
            chesses: chessesDefault,
            currentSide: 1,
            latestMoveChessName: null, // 最新移动的棋子的名称
        },
    ]);
    let [actions, setActions] = useState(dummyData);
    // [
    // {
    //     from: {
    //         name: 'S1',
    //         siblings: ['S2', 'S3', 'S4', 'C3'],
    //         side: 1,
    //         picture: chessIndex.red[1].picture,
    //     },
    //     to: {
    //         name: 'C3',
    //         siblings: ['C5', 'C2', 'S1', 'C4'],
    //         side: null,
    //         picture: null,
    //     },
    // },
    // {
    //     from: {
    //         name: 'N3',
    //         siblings: ['N2', 'N1', 'N4', 'C1'],
    //         side: 0,
    //         picture: chessIndex.yellow[2].picture,
    //     },
    //     to: {
    //         name: 'C1',
    //         siblings: ['N3', 'C2', 'C5', 'C4'],
    //         side: null,
    //         picture: null,
    //     },
    // },
    // {
    //     from: {
    //         name: 'C3',
    //         siblings: ['C5', 'C2', 'S1', 'C4'],
    //         side: 1,
    //         picture: chessIndex.red[1].picture,
    //     },
    //     to: {
    //         name: 'C5',
    //         siblings: ['C1', 'C2', 'C3', 'C4'],
    //         side: null,
    //         picture: null,
    //     },
    // },
    // {
    //     from: {
    //         name: 'C1',
    //         siblings: ['N3', 'C2', 'C5', 'C4'],
    //         side: 0,
    //         picture: chessIndex.yellow[2].picture,
    //     },
    //     to: {
    //         name: 'C2',
    //         siblings: ['C1', 'W4', 'C3', 'C5'],
    //         side: null,
    //         picture: null,
    //     },
    // },
    // {
    //     from: {
    //         name: 'C5',
    //         siblings: ['C1', 'C2', 'C3', 'C4'],
    //         side: 1,
    //         picture: chessIndex.red[1].picture,
    //     },
    //     to: {
    //         name: 'C1',
    //         siblings: ['N3', 'C2', 'C5', 'C4'],
    //         side: null,
    //         picture: null,
    //     },
    // },
    // {
    //     from: {
    //         name: 'C2',
    //         siblings: ['C1', 'W4', 'C3', 'C5'],
    //         side: 0,
    //         picture: chessIndex.yellow[2].picture,
    //     },
    //     to: {
    //         name: 'C5',
    //         siblings: ['C1', 'C2', 'C3', 'C4'],
    //         side: null,
    //         picture: null,
    //     },
    // },
    // {
    //     from: {
    //         name: 'C1',
    //         siblings: ['N3', 'C2', 'C5', 'C4'],
    //         side: 1,
    //         picture: chessIndex.red[1].picture,
    //     },
    //     to: {
    //         name: 'N3',
    //         siblings: ['N2', 'N1', 'N4', 'C1'],
    //         side: null,
    //         picture: null,
    //     },
    // },
    // {
    //     from: {
    //         name: 'C5',
    //         siblings: ['C1', 'C2', 'C3', 'C4'],
    //         side: 0,
    //         picture: chessIndex.yellow[2].picture,
    //     },
    //     to: {
    //         name: 'C1',
    //         siblings: ['N3', 'C2', 'C5', 'C4'],
    //         side: null,
    //         picture: null,
    //     },
    // },
    // ]
    let [index, setIndex] = useState(0);
    let [pick, setPick] = useState(true);

    function move() {
        if (pick) moveFrom();
        else moveTo();
        pick === true ? setPick(false) : setPick(true);
    }
    function moveFrom() {
        handleClickChess(actions[index].from);
    }
    function moveTo() {
        // console.log(actions);
        handleClickChessWrap(actions[index].to);
        if (index < actions.length - 1) setIndex(index + 1);
    }
    function handleClickChess(chessData) {
        if (sides.includes(winnerSide)) return; // 已经有人胜出了，返回
        if (chessData.side !== history[history.length - 1].currentSide) return; // 如果点击的不是当前可下方，返回

        // 1、改变点击棋子的样式
        setClickedChess(chessData);
        // 2、找落子点
        let newAbleReceive = getAbleReceive(chessData, history[history.length - 1].chesses);
        setAbleReceive(newAbleReceive);
    }

    // 处理点击落子点
    function handleClickChessWrap(chessData) {
        // console.log('handleClickChessWrap');
        // console.log(clickedChess);
        // 已经有人胜出了，返回
        if (sides.includes(winnerSide)) return;

        // 如果不是落子点，返回
        if (!isOneOfAbleReceive(chessData, ableReceive)) return;

        // 落子点变成点击棋子的 side
        let newChesses = _.cloneDeep(history[history.length - 1].chesses);
        newChesses = getNewChesses(newChesses, chessData, clickedChess.side, clickedChess.picture);

        // 当前点击的棋子 变成 空格
        newChesses = getNewChesses(newChesses, clickedChess, null, null);

        // 得到新的下一步玩家
        let newCurrentSide = history[history.length - 1].currentSide === 0 ? 1 : 0;

        // 清空 当前点击的棋子
        setClickedChess(null);

        // 清空 落子点
        setAbleReceive([]);

        // 得到新的 history
        let newHistory = _.cloneDeep(history);
        newHistory.push({
            chesses: newChesses,
            currentSide: newCurrentSide,
            latestMoveChessName: chessData.name,
        });

        // 判断有没有棋子被吃掉
        let beEatenChesses = findBeEatenChesses(newChesses, newCurrentSide);
        // 如果这一步没有棋子被吃掉
        if (beEatenChesses.length === 0) {
            setHistory(newHistory);
            return;
        }

        // 有棋子被吃掉
        // 先执行将被吃掉棋子闪动几下的动画
        setHistory(newHistory);
        // setTimeout(() => {
        shiningAnimation(newChesses, beEatenChesses, 0, newCurrentSide, newHistory, chessData.name);
        // }, 30);
    }

    function shiningAnimation(
        newChesses,
        beEatenChesses,
        shiningTimes,
        newCurrentSide,
        newHistory,
        latestMoveChessName
    ) {
        let cashChesses = _.cloneDeep(newChesses);
        let cashHistory = _.cloneDeep(newHistory);

        let timer = setInterval(() => {
            cashHistory = _.cloneDeep(cashHistory);

            cashChesses = changeCashChesses(cashChesses, beEatenChesses, newCurrentSide);
            cashHistory.pop();
            cashHistory.push({
                chesses: cashChesses,
                currentSide: newCurrentSide,
                latestMoveChessName: latestMoveChessName,
            });
            setHistory(cashHistory);

            shiningTimes--;
            if (shiningTimes < 0) {
                // 动画执行完了
                clearInterval(timer);
                // 去掉被吃掉的棋子
                cashHistory = getNewHistoryAfterDeleteBeEatenChesses(
                    beEatenChesses,
                    cashHistory,
                    newCurrentSide,
                    latestMoveChessName
                );
                setHistory(cashHistory);
                //新增淘汰旗子
                if (newCurrentSide === 0) {
                    setYellow([...yellow, ...beEatenChesses]);
                } else {
                    setRed([...red, ...beEatenChesses]);
                }

                // 判断有没有胜出方
                let winner = getWinner(cashHistory, newCurrentSide);
                setWinnerSide(winner);
            }
        }, 500);
    }

    function getWinner(newHistory, newCurrentSide) {
        let winner = null; // 获胜方的side
        let newCurrentSideCount = 0; // 被吃掉方剩下的棋子个数

        let latestChesses = newHistory[newHistory.length - 1].chesses;
        for (let latestChessItem of latestChesses) {
            if (latestChessItem.side === newCurrentSide) {
                newCurrentSideCount++;
            }
        }
        if (newCurrentSideCount <= 2) {
            // 如果被吃掉方的棋子只剩下2颗或更少，则对方获胜
            winner = newCurrentSide === 0 ? 1 : 0;
        }

        return winner;
    }

    /**
     * 从当前棋子布局中删除掉 被吃掉的棋子（被吃掉的棋子side设为null），返回更新后的 history
     * @param beEatenChesses : 被吃掉的棋子
     */
    function getNewHistoryAfterDeleteBeEatenChesses(beEatenChesses, newHistory, newCurrentSide, latestMoveChessName) {
        let newChesses = _.cloneDeep(newHistory[newHistory.length - 1].chesses);
        for (let chessItem of newChesses) {
            if (beEatenChesses.includes(chessItem.name)) {
                chessItem.side = null;
            }
        }
        newHistory.pop();
        newHistory.push({
            chesses: newChesses,
            currentSide: newCurrentSide,
            latestMoveChessName: latestMoveChessName,
        });
        return newHistory;
    }

    function changeCashChesses(cashChesses, beEatenChesses, newCurrentSide) {
        cashChesses = _.cloneDeep(cashChesses);
        for (let chessItem of cashChesses) {
            if (beEatenChesses.includes(chessItem.name)) {
                if (chessItem.side === newCurrentSide) {
                    chessItem.side = null;
                } else if (chessItem.side === null) {
                    chessItem.side = newCurrentSide;
                }
            }
        }

        return cashChesses;
    }

    // 处理 点击 返回上一步
    // function goBack() {
    //     setIndex(index - 1);
    //     setClickedChess(null);
    //     setAbleReceive([]);
    //     setWinnerSide(null);

    //     let newHistory = _.cloneDeep(history);
    //     newHistory.pop();
    //     setHistory(newHistory);
    // }

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/scripts/autoPlay.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="game">
            <div className="board">
                {/*下一步*/}
                {/* {winnerSide === null && (
                    <div className="next-step">
                        <span>下一步：</span>
                        <button
                            style={{
                                backgroundColor: history[history.length - 1].currentSide === 0 ? '#FF3E41' : '#FCFDAF',
                            }}
                        />
                    </div>
                )} */}

                <Board
                    boardWidth={boardWidth + 'px'}
                    chesses={history[history.length - 1].chesses}
                    r={r}
                    a={a}
                    clickedChess={clickedChess}
                    handleClickChess={handleClickChess}
                    ableReceive={ableReceive}
                    handleClickChessWrap={handleClickChessWrap}
                    latestMoveChessName={history[history.length - 1].latestMoveChessName}
                />
            </div>
            <div className="buttonBlock">
                <Buttons move={move} />
                <TeamList sides={sides} winnerSide={winnerSide} />
            </div>
        </div>
    );
}

const Buttons = (props) => {
    let { move } = props;
    function replay() {
        window.location.reload();
    }
    const title = { step: '步數', speed: '速度' };
    const id = { step: 'step', speed: 'speed' };
    const defaultValue = { step: '60', speed: '100' };
    const max = { step: '60', speed: '200' };
    const min = { step: '0', speed: '25' };
    return (
        <div className="player">
            <div className="steps">
                <Slider
                    title={title.step}
                    _id={id.step}
                    defaultValue={defaultValue.step}
                    max={max.step}
                    min={min.step}
                ></Slider>
                <Slider
                    title={title.speed}
                    _id={id.speed}
                    defaultValue={defaultValue.speed}
                    max={max.speed}
                    min={min.speed}
                ></Slider>
                {/* <label>`
                    步數:
                    <input id="step" type="number" />
                </label> */}

                {/* 調整速度 */}
                {/* <select id="speed">
                    <option value="1000">-- 速度 --</option>
                    <option value="2000">0.25</option>
                    <option value="1500">0.5</option>
                    <option value="1000">1</option>
                    <option value="500">1.5</option>
                    <option value="250">2</option>快
                </select> */}
            </div>
            <div className="btns">
                <div id="restart" onClick={replay}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        fill="currentColor"
                        class="bi bi-arrow-repeat"
                        viewBox="0 0 16 16"
                    >
                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                        <path
                            fill-rule="evenodd"
                            d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                        />
                    </svg>
                </div>
                <div id="next" onClick={() => move()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        fill="currentColor"
                        class="bi bi-arrow-down-square-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
                    </svg>
                </div>
                {/* 播放 */}
                <div id="play">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        fill="currentColor"
                        class="bi bi-play-btn-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                    </svg>
                </div>
                <div id="stop">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        fill="currentColor"
                        class="bi bi-pause-btn-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.25-7C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Game;
