import React from 'react';
import styled from 'styled-components';
import LogoSrc from '../assets/images/beaver.png';

const HeadWrapper = styled.div`
    height: 5vh;
    display: flex;
    width: 100%;
    border-bottom-color: rgb(219, 219, 219);
    border-bottom-style: solid;
    border-bottom-width: 1.5px;
    background-color: white;
`;
const TextWapper = styled.h1`
    display: flex;
    color: black;
    font-weight: 600;
    letter-spacing: 0.1em;
    align-items: center;
`;

const LogoImage = styled.img`
    padding-left: 10%;
`;

const Header = () => {
    return (
        <HeadWrapper>
            <LogoImage src={LogoSrc} />
            <TextWapper>小海狸的下棋遊戲</TextWapper>
        </HeadWrapper>
    );
};

export default Header;
