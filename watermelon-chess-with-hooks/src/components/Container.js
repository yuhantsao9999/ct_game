import React, { useState } from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import Game from './Game';
import Header from './Header';
import Footer from './Footer';
import { BattleProcessProvider, BattleProcessProviderContext } from '../hooks/context';

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

const Container = () => {
    return (
        <Route path="/watermelonChess/:playerA/:playerB">
            <Wrapper>
                <Header />
                <ContentWapper>
                    <ContextStoreProvider>
                        <BattleProcessProvider>
                            <Game />
                        </BattleProcessProvider>
                    </ContextStoreProvider>
                </ContentWapper>
                <Footer />
            </Wrapper>
        </Route>
    );
};

export default Container;
