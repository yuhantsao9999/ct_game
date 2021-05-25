import React from 'react';
import styled from 'styled-components';

const ChessWrap = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const Button = styled.button`
    width: ${(props) => props.chessWidth}px;
    height: ${(props) => props.chessWidth}px;
    border-radius: ${(props) => props.chessWidth / 2}px;
    box-shadow: ${(props) => props.boxShadow};
    background-image: ${(props) => `url('${props.chessData.picture}')`};
    border-style: none;
    outline: none;
    padding: 0;
    background-size: contain;
`;

function Chess({ chessData, chessWidth, boxShadow, handleClickChess }) {
    return (
        <ChessWrap>
            <Button
                chessData={chessData}
                chessWidth={chessWidth}
                boxShadow={boxShadow}
                onClick={() => handleClickChess(chessData)}
            ></Button>
        </ChessWrap>
    );
}

export default Chess;
