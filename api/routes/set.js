const express = require('express');
const { insertOne, findOne } = require('../controller/teamData');
const router = express.Router();

router.post('/insertTeamId', async (req, res) => {
    const result = await insertOne(req);
    if (result.error) {
        res.status(404).send('Insert error');
    } else res.send('Insert successfully');
});

router.post('/checkActivityName', async (req, res) => {
    const result = await findOne(req);
    if (result.error) {
        res.status(409).send('Not found');
    } else {
        res.send('Activity Name Exist');
    }
});

module.exports = router;
