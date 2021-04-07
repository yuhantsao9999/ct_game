const express = require('express');
const router = express.Router();
const { findActivityName } = require('../controller/teamData');

router.post('/checkActivityExist', async (req, res) => {
    const { activityName } = req.body;
    const result = await findActivityName(req);
    console.log('checkActivityExist result', result);
    if (result.error) {
        res.status(404).send('無此活動名稱');
    } else {
        res.send(result.data);
        // res.redirect(`./grouping?id=${activityName}`);
    }
});

module.exports = router;
