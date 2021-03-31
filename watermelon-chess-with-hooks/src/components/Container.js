import React, { useState } from 'react';
import styled from 'styled-components';
import Game from './Game';
import TeamList from './TeamList';
import Buttons from './Buttons';
import Header from './Header';
import Footer from './Footer';

const Wrapper = styled.div`
    width: 100%;
    min-height: 100%;
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
        <Wrapper>
            <Header />
            <ContentWapper>
                <ContextStoreProvider>
                    <Game />
                    <TeamList />
                </ContextStoreProvider>
            </ContentWapper>
            <Footer />
        </Wrapper>
    );
};

export default Container;
