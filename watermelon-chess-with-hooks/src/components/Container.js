import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Route, useParams } from 'react-router-dom';
import Game from './Game';
import Header from './Header';
import Footer from './Footer';
import { BattleProcessProvider, BattleProcessContext } from '../hooks/context';

const Wrapper = styled.div`
    width: 100%;
`;

const ContentWapper = styled.div`
    display: flex;
    width: 100%;
`;

//建立淘汰棋的 Context
export const ContextStore = React.createContext(null);

export const ContextStoreProvider = ({ children }) => {
    const [red, setRed] = useState([]);
    const [yellow, setYellow] = useState([]);

    const context = {
        red,
        setRed,
        yellow,
        setYellow,
    };

    return <ContextStore.Provider value={context}>{children}</ContextStore.Provider>;
};

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
        <Route path="/watermelonChess/:activityName/:playerA/:playerB">
            <Wrapper>
                <Header />
                <ContentWapper>
                    <ContextStoreProvider>
                        <BattleProcessProvider>
                            <BattleProcessContent />
                        </BattleProcessProvider>
                    </ContextStoreProvider>
                </ContentWapper>
                <Footer />
            </Wrapper>
        </Route>
    );
};

export default Container;
