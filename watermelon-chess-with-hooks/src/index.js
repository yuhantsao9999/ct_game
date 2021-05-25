import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Container from './components/Container';
import './index.scss';

ReactDOM.render(
    <Router>
        <Switch>
            <Container />
        </Switch>
    </Router>,
    document.getElementById('root')
);
