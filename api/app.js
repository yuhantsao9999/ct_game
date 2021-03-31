require('./models/Model.js');
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const port = 3080;

// place holder for the data
const users = [];
app.use(bodyParser.json());

app.use(bodyParser.json({ limit: '50000mb' }));
app.use(bodyParser.urlencoded({ limit: '50000mb', extended: true }));
app.use(express.static(path.join(__dirname, '../watermelon-chess-with-hooks/build')));

// app.get('/api/users', (req, res) => {
//     console.log('api/users called!!!!');
//     res.json(users);
// });

// app.post('/api/user', (req, res) => {
//     const user = req.body.user;
//     console.log('Adding user::::::::', user);
//     users.push(user);
//     res.json('user addedd');
// });

// app.get('/', (req, res) => {
//     res.send('App Works hihihihi !!!!');
// });

const { pages } = require('./router');

app.use(express.static('public', { extensions: ['html'] }));

app.use('/', pages.main);
app.use('/', pages.select);
app.use('/', pages.start);
app.use('/api', pages.set);
app.use('/api', pages.upload);
app.use('/api', pages.grouping);

app.get('/watermelonChess', (req, res) => {
    res.sendFile(path.join(__dirname, '../watermelon-chess-with-hooks/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
