const express = require('express');
const router = express.Router();
const { findActivityName } = require('../controller/teamData');

router.post('/checkActivityExist', async (req, res) => {
    const { activityName } = req.body;
    const result = await findActivityName(req);
    if (result.error) {
        res.status(404).send('Not found');
    } else {
        res.redirect(`./grouping?id=${activityName}`);
    }
});

module.exports = router;
