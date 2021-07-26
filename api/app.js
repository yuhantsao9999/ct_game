require('./models/Model.js');
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = 3080;

// place holder for the data
const users = [];
// app.use(bodyParser.json());

app.use(express.json({ limit: '50000mb' }));
app.use(express.urlencoded({ limit: '50000mb', extended: true }));
app.use(express.static(path.join(__dirname, '../watermelon-chess-with-hooks/build')));
app.use(express.static(path.join(__dirname, 'public/assets/image/')));

const { pages, publicApi } = require('./router');

app.use(express.static('public', { extensions: ['html'] }));

app.use('/', pages.main);
app.use('/', pages.start);
app.use('/api', pages.set);
app.use('/api', pages.upload);
app.use('/api', pages.grouping);
app.use('/api', publicApi.convertCode);
app.use('/api', publicApi.battleProcess);

app.get('/watermelonChess/:activityName/:playerA/:playerB', (req, res) => {
    res.sendFile(path.join(__dirname, '../watermelon-chess-with-hooks/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
