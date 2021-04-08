import React from 'react';
import styled from 'styled-components';
// .footer-wapper {
//     width: 100%;
//     box-shadow: 0 -5px 6px rgb(19 35 47 / 30%);
//     border-top-color: rgb(219, 219, 219);
//     border-top-style: solid;
//     border-top-width: 1.5px;
//     height: 5vh;
// }
// .footer {
//     width: 100%;
//     text-align: center;
//     margin-top: 1vh;
// }
const FootWrapper = styled.div`
    position: relative;
    clear: both;
    border-top-color: rgb(219, 219, 219);
    border-top-style: solid;
    border-top-width: 1.5px;
    height: 5vh;
`;
const CopyrightWapper = styled.h1`
    width: 100%;
    text-align: center;
    margin-top: 1vh;
`;
const Copyright = styled.p`
    font-family: '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans',
        sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    font-size: 20px;
    color: #475b69;
    font-weight: bold;
    text-decoration: none;
    justify-content: center;
    align-items: center;
`;

const Footer = () => {
    return (
        <FootWrapper>
            <CopyrightWapper>
                <Copyright>© 國立臺灣師範大學  資訊工程系  VIPLab</Copyright>
            </CopyrightWapper>
        </FootWrapper>
    );
};

export default Footer;
