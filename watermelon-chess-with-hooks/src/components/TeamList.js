import * as React from 'react';
import { useContext } from 'react';
import queryString from 'query-string';
import { useParams } from 'react-router-dom';
// import { useLocation } from 'react-router';
// import { useSelector, useDispatch } from 'react-redux';
// import { TagCategoryDataContext } from '../../contexts';
import styled, { css } from 'styled-components';
import { ContextStore } from '../hooks/context';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 7%;
    padding: 30px;
    width: 90%;
`;

const buttonCenter = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    font-size: 1em;
`;

const TeamListItem = styled.div`
    ${buttonCenter}
    width: 35px;
    height: 35px;
    border-width: 2px;
    border-style: solid;
    border-color: black;
    border-radius: 999em;
    background-color: ${(props) => props.teamColor};
    /* transition: background 0.3s ease; */
`;

const BeEatenChessesWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const BeEatenRedChesses = styled.div`
    margin: 10px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-image: url(/棋子-紅-淘汰棋.png);
    background-size: 50px 50px;
    background-position: center;
`;
const BeEatenYellowChesses = styled.div`
    margin: 10px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-image: url(/棋子-黃-淘汰棋.png);
    background-size: 50px 50px;
    background-position: center;
`;

// const urlParams = new URLSearchParams(window.location.search);

const TeamList = (props) => {
    let { sides, winnerSide } = props;
    const result = useContext(ContextStore);
    // console.log('winner result', result);
    // let params = queryString.parse(window.location.search);
    const { playerA } = useParams();
    const { playerB } = useParams();

    return (
        <Wrapper>
            {/*獲勝方*/}
            {sides.includes(winnerSide) && (
                <div className="winner">
                    <span>獲勝方是：</span>
                    {winnerSide === -1 ? (
                        <div>平手</div>
                    ) : (
                        <button
                            style={{
                                backgroundColor:
                                    winnerSide === 1 ? '#f5f516' : winnerSide === 0 ? '#d80f0f' : '#000000', //黃：紅
                            }}
                        />
                    )}
                </div>
            )}
            <div className="nameList">
                <div className="up">
                    <TeamListItem teamColor="#d80f0f"></TeamListItem>
                    {playerA}
                </div>
                <BeEatenChessesWrapper>
                    {result.yellow.map((item, i) => (
                        <BeEatenYellowChesses key={`beEatenYellowChesses-${item}-${i}`}></BeEatenYellowChesses>
                    ))}
                </BeEatenChessesWrapper>
            </div>
            <div className="nameList">
                <div className="up">
                    <TeamListItem teamColor="#f5f516"></TeamListItem>
                    {playerB}
                </div>
                <BeEatenChessesWrapper>
                    {result.red.map((item, i) => (
                        <BeEatenRedChesses key={`beEatenRedChesses-${item}-${i}`}></BeEatenRedChesses>
                    ))}
                </BeEatenChessesWrapper>
            </div>
        </Wrapper>
    );
};

export default TeamList;
