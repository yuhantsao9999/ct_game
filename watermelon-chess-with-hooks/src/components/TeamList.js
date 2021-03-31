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
    width: 30%;
`;

const buttonCenter = css`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2.5px;
    font-size: 1em;
`;

const TeamListItem = styled.div`
    ${buttonCenter}
    width: 60%;
    display: block;
    background: #3c8f9a;

    color: white;
    padding: 0.75em;
    font-size: 1em;
    border-radius: 0.15em;
    /* transition: background 0.3s ease; */
`;
const BeEatenChessesWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

const BeEatenRedChesses = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 10px;
    padding: 7px 16px;
    box-sizing: border-box;

    border-radius: 100px;
    width: 78px;
    height: 78px;
    background: url(棋子-紅-淘汰棋.png);
`;
const BeEatenYellowChesses = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 10px;
    padding: 7px 16px;
    box-sizing: border-box;

    border-radius: 100px;
    width: 78px;
    height: 78px;
    background: url(棋子-黃-淘汰棋.png);
`;

// const dummyTeamList = { playerA: '于立隊  5-2', playerB: '喻文隊  10-1' };
// const urlParams = new URLSearchParams(window.location.search);
// const date = urlParams.get('date');

const TeamList = () => {
    const result = useContext(ContextStore);
    let params = queryString.parse(window.location.search);

    return (
        <Wrapper>
            <TeamListItem key={`team-red`}>{params.playerA}</TeamListItem>
            <BeEatenChessesWrapper>
                {result.red.map((item, i) => (
                    <BeEatenRedChesses key={`beEatenRedChesses-${item}-${i}`}></BeEatenRedChesses>
                ))}
            </BeEatenChessesWrapper>
            <TeamListItem key={`team-yellow`}>{params.playerB}</TeamListItem>
            <BeEatenChessesWrapper>
                {result.yellow.map((item, i) => (
                    <BeEatenYellowChesses key={`beEatenYellowChesses-${item}-${i}`}></BeEatenYellowChesses>
                ))}
            </BeEatenChessesWrapper>
        </Wrapper>
    );
};

export default TeamList;
