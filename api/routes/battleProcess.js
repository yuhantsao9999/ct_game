const express = require('express');
const { insertOneProcess, findLatestProcess } = require('../controller/battle');
const router = express.Router();

router.post('/insertBattleProcess', async (req, res) => {
    const result = await insertOneProcess(req);
    if (result.error) {
        res.status(404).send('Insert error');
    } else res.send('Insert successfully');
});
router.post('/getBattleProcess', async (req, res) => {
    const result = await findLatestProcess(req);
    if (result.error) {
        res.status(404).send('Not found');
    } else res.send(result.data);
});

module.exports = router;
