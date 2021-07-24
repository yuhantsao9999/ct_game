import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Route, useParams } from 'react-router-dom';
import Game from './Game';
import Header from './Header';
import Footer from './Footer';
import {
    BattleProcessProvider,
    BattleProcessContext,
    ContextStoreProvider,
    SliderContextProvider,
} from '../hooks/context';

const Wrapper = styled.div`
    width: 100%;
`;

const ContentWapper = styled.div`
    display: flex;
    width: 100%;
`;

const BattleProcessContent = () => {
    const { setActivityName, setPlayerA, setPlayerB } = useContext(BattleProcessContext);
    const { activityName, playerA, playerB } = useParams();

    useEffect(() => {
        setActivityName(activityName);
        setPlayerA(playerA);
        setPlayerB(playerB);
    }, [activityName, playerA, playerB]);

    return <Game />;
};
const Container = () => {
    return (
        <Route path="/:activityName/:playerA/:playerB">
            <Wrapper>
                <Header />
                <ContentWapper>
                    <ContextStoreProvider>
                        <BattleProcessProvider>
                            <SliderContextProvider>
                                <BattleProcessContent />
                            </SliderContextProvider>
                        </BattleProcessProvider>
                    </ContextStoreProvider>
                </ContentWapper>
                <Footer />
            </Wrapper>
        </Route>
    );
};

export default Container;
