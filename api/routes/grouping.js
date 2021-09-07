const express = require('express');
const { getTotalTeamNum } = require('../controller/teamData');
const router = express.Router();

router.post('/getTotalTeamNum', async (req, res) => {
    const data = req.body;
    const totalTeamNumber = await getTotalTeamNum(data);
    if (totalTeamNumber.error) {
        res.status(404).send('Not found');
    } else res.send(totalTeamNumber);
});

module.exports = router;
