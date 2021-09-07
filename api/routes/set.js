const express = require('express');
const { checkActivityExist, insertNewUsers } = require('../controller/account');
const router = express.Router();

router.post('/insertTeamId', async (req, res) => {
    const data = req.body;
    const result = await insertNewUsers(data);
    if (result.error) {
        res.status(404).send('Insert error');
    } else res.send('Insert successfully');
});

router.post('/checkActivityExist', async (req, res) => {
    const { activityName } = req.body;
    const result = await checkActivityExist(activityName);
    if (result.error) {
        res.status(404).send('Not found');
    } else {
        res.send('Activity Name Exist');
    }
});

module.exports = router;
