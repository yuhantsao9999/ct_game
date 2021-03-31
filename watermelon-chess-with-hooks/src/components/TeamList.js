import * as React from 'react';
import { useContext } from 'react';
import queryString from 'query-string';
// import { useRouteMatch, useParams, useLocation } from 'react-router-dom';
// import { useLocation } from 'react-router';
// import { useSelector, useDispatch } from 'react-redux';
// import { TagCategoryDataContext } from '../../contexts';
import styled, { css } from 'styled-components';
import { ContextStore } from './Container';

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
    background-color: ${props => props.teamColor}
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
    background-image: url(棋子-紅-淘汰棋.png);
    background-size: 50px 50px;
    background-position: center;
`;
const BeEatenYellowChesses = styled.div`
    margin: 10px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-image: url(棋子-黃-淘汰棋.png);
    background-size: 50px 50px;
    background-position: center;
`;

// const dummyTeamList = { playerA: '于立隊  5-2', playerB: '喻文隊  10-1' };
// const urlParams = new URLSearchParams(window.location.search);
// const date = urlParams.get('date');

const TeamList = () => {
    const result = useContext(ContextStore);
    let params = queryString.parse(window.location.search);

    return (
        <Wrapper>
            <div className="nameList">
                <div className="up">
                    <TeamListItem teamColor="#d80f0f"></TeamListItem>
                    {params.playerA}
                </div>
                <BeEatenChessesWrapper>
                    {result.red.map((item, i) => (
                        <BeEatenRedChesses key={`beEatenRedChesses-${item}-${i}`}></BeEatenRedChesses>
                    ))}
                </BeEatenChessesWrapper>
            </div>
            <div className="nameList">
                <div className="up">
                    <TeamListItem teamColor="#f5f516"></TeamListItem>
                    {params.playerB}
                </div>
                <BeEatenChessesWrapper>
                    {result.yellow.map((item, i) => (
                        <BeEatenYellowChesses key={`beEatenYellowChesses-${item}-${i}`}></BeEatenYellowChesses>
                    ))}
                </BeEatenChessesWrapper>
            </div>
        </Wrapper >
    );
};

export default TeamList;