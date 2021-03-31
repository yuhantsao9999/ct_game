import React from 'react';
import Chess from './Chess';
import { getChessPosition, isOneOfAbleReceive } from '../utils';

function Board (props) {
    let {
        boardWidth,
        chesses,
        r,
        a,
        handleClickChess,
        clickedChess,
        ableReceive,
        handleClickChessWrap,
        latestMoveChessName,
    } = props;

    return (
        <div
            className="board"
            style={{
                width: boardWidth,
                height: boardWidth,
            }}
        >
            {chesses.map((chessData) => {
                let chessWidth = 2 * r; // 棋子的宽度
                // 棋子的top、left
                let { top: chessTop, left: chessLeft } = getChessPosition(chessData.name, a);
                let boxShadow = `2px 2px 2px rgba(0,0,0,0.2)`;

                // 当前棋子是当前点击的棋子
                if (clickedChess && clickedChess.name === chessData.name) {
                    chessWidth = 2.5 * r;
                    chessTop = chessTop - r / 4;
                    chessLeft = chessLeft - r / 4;
                    boxShadow = `4px 4px 4px rgba(0,0,0,0.2)`;
                }

                let dotWidth = 10;

                return (
                    <div
                        className="chess-wrap"
                        key={chessData.name}
                        style={{
                            width: chessWidth + 'px',
                            height: chessWidth + 'px',
                            top: chessTop + 'px',
                            left: chessLeft + 'px',
                        }}
                        onClick={() => {
                            console.log('chesses.map', chessData);
                            handleClickChessWrap(chessData);
                        }}
                    >
                        {(chessData.side === 0 || chessData.side === 1) && (
                            <Chess
                                chessData={chessData}
                                chessWidth={chessWidth}
                                boxShadow={boxShadow}
                                handleClickChess={handleClickChess}
                                clickedChess={clickedChess}
                                ableReceive={ableReceive}
                                handleClickChessWrap={handleClickChessWrap}
                            />
                        )}

                        {chessData.side === null && isOneOfAbleReceive(chessData, ableReceive) && (
                            <div
                                className="green-dot"
                                style={{
                                    width: dotWidth + 'px',
                                    height: dotWidth + 'px',
                                    borderRadius: dotWidth / 2 + 'px',
                                }}
                            />
                        )}

                        {latestMoveChessName === chessData.name && (
                            <div
                                className="red-dot"
                                style={{
                                    width: dotWidth + 'px',
                                    height: dotWidth + 'px',
                                    borderRadius: dotWidth / 2 + 'px',
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default Board;
