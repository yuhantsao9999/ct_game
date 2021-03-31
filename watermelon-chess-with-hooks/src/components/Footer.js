import React from 'react';
import styled from 'styled-components';

const FootWrapper = styled.div`
    position: relative;
    clear: both;
    border-top-color: rgb(219, 219, 219);
    border-top-style: solid;
    border-top-width: 1.5px;
`;
const CopyrightWapper = styled.h1`
    width: 100%;
    text-align: center;
    margin: auto;
`;
const Copyright = styled.p`
    font-family: '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans',
        sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 20px;
    color: #475b69;
    font-weight: bold;
    text-decoration: none;
`;

const Footer = () => {
    return (
        <FootWrapper>
            <CopyrightWapper>
                <Copyright>© 2021 VIPLab, National Taiwan Normal University.</Copyright>
            </CopyrightWapper>
        </FootWrapper>
    );
};

export default Footer;
