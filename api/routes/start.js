const express = require('express');
const router = express.Router();
const { findActivityName } = require('../controller/teamData');

router.post('/checkActivityExist', async (req, res) => {
    const result = await findActivityName(req);
    if (result.error) {
        res.status(404).send('無此活動名稱');
    } else {
        res.send(result.data);
    }
});

module.exports = router;
