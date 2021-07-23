import React, { useState, useContext, useEffect } from 'react';
import Board from './Board';
import TeamList from './TeamList';
import styled from 'styled-components';
import { initData } from '../constant/chessIndex';
import { chessesDefault, findBeEatenChesses, getAbleReceive, getNewChesses, isOneOfAbleReceive } from '../utils';
import _ from 'lodash';
import useInterval from '../hooks/useInterval';
import Slider from './Slider';
import SpeedSlider from './SpeedSlider';
import { BattleProcessContext, ContextStore, SliderContext } from '../hooks/context';
import { matchBattleProcessData, matchBoardIndex, mappingWinnerIndex } from '../utils/matchBattleProcessData';

function Game() {
    const { red, setRed, yellow, setYellow } = useContext(ContextStore);
    const { speed, setSpeed, specifedStep, setSpecifedStep } = useContext(SliderContext);
    let boardWidth = document.documentElement.clientWidth * 0.45;
    let r = 0.0463 * boardWidth; // 棋子的半径
    let a = (0.5 * boardWidth - r) / 3; // 五个小圆的半径

    let [clickedChess, setClickedChess] = useState(null); // 当前点击的棋子
    let [ableReceive, setAbleReceive] = useState([]); // 落子点

    let sides = [0, 1, -1]; // 對戰雙方
    let [winnerSide, setWinnerSide] = useState(null); // 獲勝方
    let [history, setHistory] = useState([
        {
            chesses: chessesDefault,
            currentSide: 0, //初始旗子side 紅
            latestMoveChessName: null, // 最新移动的棋子的名称
        },
    ]);
    const { result: battleData } = useContext(BattleProcessContext);

    let [actions, setActions] = useState(initData);
    let [index, setIndex] = useState(0);
    let [pick, setPick] = useState(false);
    const [isPlaying, setPlaying] = useState(false);
    // const [isToSpecifedStep, setIsToSpecifedStep] = useState(false);

    useEffect(() => {
        const convertBattleProcess = matchBattleProcessData(battleData.process);
        console.log('convertBattleProcess', convertBattleProcess);
        setActions(convertBattleProcess);

        if (battleData.process.length !== 0 && index === battleData.process.length) {
            const winner = mappingWinnerIndex(battleData);
            setWinnerSide(winner);
        }
    }, [battleData, index]);

    useEffect(() => {
        if (sides.includes(winnerSide)) return;
        if (pick) moveFrom();
        else moveTo();
    }, [pick]);

    const move = () => {
        if (sides.includes(winnerSide)) return;
        setPick((prevPick) => !prevPick);
    };

    // useEffect(() => {
    //     //跳到第i步
    //     for (let i = 0; i < specifedStep * 2; i++) {
    //         (function (x) {
    //             setTimeout(function () {
    //                 setPick((prevPick) => !prevPick);
    //             }, 250);
    //         })(i);
    //     }
    // }, [specifedStep]);

    // useInterval(
    //     () => {
    //         if (sides.includes(winnerSide)) return;
    //         setPick((prevPick) => !prevPick);
    //     },

    //     isToSpecifedStep ? 25 : null
    // );

    // useEffect(() => {
    //     if (sides.includes(winnerSide) || index == specifedStep) {
    //         setIsToSpecifedStep(false);
    //         setPlaying(false);
    //     }
    // }, [index, specifedStep, sides, winnerSide]);

    const play = () => {
        // 已經有人勝出了，返回
        if (sides.includes(winnerSide)) return;
        //用什麼速度播放
        setPlaying(true);
        setSpeed(speed);
    };

    useInterval(
        () => {
            if (sides.includes(winnerSide)) return;
            setPick((prevPick) => !prevPick);
        },

        isPlaying ? speed : null
    );

    const stop = () => {
        // setIsToSpecifedStep(false);
        setPlaying(false);
    };

    const moveFrom = () => {
        handleClickChess(actions[index].from);
    };

    const moveTo = () => {
        handleClickChessWrap(actions[index].to, actions[index].kill);
        if (actions.length > 1 && index < actions.length) setIndex(index + 1);
    };

    function handleClickChess(chessData) {
        // 已經有人勝出了，返回
        if (sides.includes(winnerSide)) return;

        // 如果点击的不是当前可下方，返回
        // if (chessData.side !== history[history.length - 1].currentSide) return;

        // 1、改变点击棋子的样式變大
        setClickedChess(chessData);
        // 2、找落子點放綠點點
        let newAbleReceive = getAbleReceive(chessData, history[history.length - 1].chesses);
        // console.log('history[history.length - 1].chesses', history[history.length - 1].chesses);
        setAbleReceive(newAbleReceive);
    }

    // 处理点击落子点
    function handleClickChessWrap(chessData, killChess) {
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
        // let newCurrentSide = history[history.length - 1].currentSide === 0 ? 1 : 0;
        let newCurrentSide = index % 2;

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
        // let beEatenChesses = findBeEatenChesses(newChesses, newCurrentSide);
        let beEatenChesses = matchBoardIndex(killChess);

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

        // let timer = setInterval(() => {
        cashHistory = _.cloneDeep(cashHistory);

        cashChesses = changeCashChesses(cashChesses, beEatenChesses, newCurrentSide);
        cashHistory.pop();
        cashHistory.push({
            chesses: cashChesses,
            currentSide: newCurrentSide,
            latestMoveChessName: latestMoveChessName,
        });
        setHistory(cashHistory);

        // shiningTimes--;
        // if (shiningTimes < 0) {
        // 动画执行完了
        // clearInterval(timer);
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
        // }
        // }, 500);
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
    function goBack() {
        if (index > 0) {
            // setIndex(index - 1);
            // setClickedChess(null);
            // setAbleReceive([]);
            // setWinnerSide(null);

            // let newHistory = _.cloneDeep(history);
            // newHistory.pop();
            // setHistory(newHistory);

            let everyChessSizeInCurrentBoard = actions[index - 2].currentBoard.map((item) => item.side);
            //TODO:refactor 更好的寫法
            let beEatenZero = ['0', '0', '0', '0', '0', '0'];
            let beEatenOne = ['1', '1', '1', '1', '1', '1'];

            for (let i = 0; i < everyChessSizeInCurrentBoard.length; i++) {
                if (everyChessSizeInCurrentBoard[i] == 0) {
                    beEatenZero.pop();
                }
                if (everyChessSizeInCurrentBoard[i] == 1) {
                    beEatenOne.pop();
                }
            }
            setIndex(index - 1);
            setHistory([
                {
                    //magic number -1 ，因為 blackBox 給的是那個 step 移動後的狀態（才能夠讓最後一步顯示 final 狀態），所以要 -1 取得移動前的狀態
                    chesses: actions[index - 2].currentBoard,
                    currentSide: (index - 1) % 2 === 1 ? 0 : 1, //初始旗子side red:0 yellow:1
                    latestMoveChessName: null, // 最新移动的棋子的名称
                },
            ]);
            setWinnerSide(null);
            setYellow([...beEatenZero]);
            setRed([...beEatenOne]);
        }
    }

    return (
        <div className="game">
            <div className="board">
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
                <Buttons
                    goBack={goBack}
                    move={move}
                    play={play}
                    stop={stop}
                    totalStep={actions.length}
                    setIndex={setIndex}
                    winnerSide={winnerSide}
                    setHistory={setHistory}
                    index={index}
                    setWinnerSide={setWinnerSide}
                    setYellow={setYellow}
                    setRed={setRed}
                />
                <TeamList sides={sides} winnerSide={winnerSide} />
            </div>
        </div>
    );
}

const ButtonWapper = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 25px;
    margin-bottom: 25px;
`;
const RestartWapper = styled.div`
    display: flex;
`;
const GoBackWapper = styled.div`
    display: flex;
`;
const NextWapper = styled.div`
    display: flex;
`;

const PlayWapper = styled.div`
    display: flex;
`;
const StopWapper = styled.div`
    display: flex;
`;

const Buttons = (props) => {
    let {
        goBack,
        move,
        play,
        stop,
        totalStep,
        setIndex,
        setHistory,
        setWinnerSide,
        winnerSide,
        index,
        setYellow,
        setRed,
    } = props;
    function replay() {
        window.location.reload();
    }
    const title = { step: '步數', speed: '速度' };
    const defaultValue = { step: '0', speed: '100' };
    const max = { step: totalStep, speed: '200' };
    const min = { step: '0', speed: '25' };

    return (
        <div className="player">
            <div className="steps">
                <Slider
                    title={title.step}
                    defaultValue={defaultValue.step}
                    max={max.step}
                    min={min.step}
                    index={index}
                    setWinnerSide={setWinnerSide}
                    winnerSide={winnerSide}
                    setIndex={setIndex}
                    setHistory={setHistory}
                    setYellow={setYellow}
                    setRed={setRed}
                ></Slider>
                <SpeedSlider title={title.speed} play={play}></SpeedSlider>
            </div>
            <ButtonWapper>
                <RestartWapper onClick={replay}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        fill="currentColor"
                        class="bi bi-arrow-repeat"
                        viewBox="0 0 16 16"
                    >
                        <title>重頭</title>
                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                        <path
                            fill-rule="evenodd"
                            d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                        />
                    </svg>
                </RestartWapper>
                <GoBackWapper onClick={goBack}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        fill="currentColor"
                        class="bi bi-skip-start-btn-fill"
                        viewBox="0 0 16 16"
                    >
                        <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm9.71-6.907L7 7.028V5.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0V8.972l2.71 1.935a.5.5 0 0 0 .79-.407v-5a.5.5 0 0 0-.79-.407z" />

                        <title>上一步</title>
                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                        <path
                            fill-rule="evenodd"
                            d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                        />
                    </svg>
                </GoBackWapper>
                {/* 播放 */}
                <PlayWapper onClick={play}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        fill="currentColor"
                        class="bi bi-play-btn-fill"
                        viewBox="0 0 16 16"
                    >
                        <title>播放</title>
                        <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814l-3.5-2.5z" />
                    </svg>
                </PlayWapper>
                <NextWapper onClick={() => move()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        fill="currentColor"
                        class="bi bi-skip-end-btn-fill"
                        viewBox="0 0 16 16"
                    >
                        <title>下一步</title>
                        <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.79-6.907A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407L9.5 8.972V10.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 0-1 0v1.528L6.79 5.093z" />
                    </svg>
                </NextWapper>
                <StopWapper onClick={stop}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="50"
                        height="50"
                        fill="currentColor"
                        class="bi bi-pause-btn-fill"
                        viewBox="0 0 16 16"
                    >
                        <title>暫停</title>
                        <path d="M0 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm6.25-7C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5zm3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5z" />
                    </svg>
                </StopWapper>
            </ButtonWapper>
        </div>
    );
};

export default Game;
