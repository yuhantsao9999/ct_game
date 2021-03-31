import React from 'react';

function Chess(props) {
    let { chessData, chessWidth, boxShadow, handleClickChess } = props;
    let backgroundImage = null;
    if (chessData.side === 0 || chessData.side === 1) {
        backgroundImage = `url('${chessData.picture}')`;
    }

    return (
        <button
            className="chess"
            style={{
                width: chessWidth + 'px',
                height: chessWidth + 'px',
                borderRadius: chessWidth / 2 + 'px',
                backgroundImage,
                boxShadow,
            }}
            onClick={() => {
                handleClickChess(chessData);
            }}
        />
    );
}

export default Chess;
