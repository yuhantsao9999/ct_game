const express = require('express');
const { insertBattleProcess, findBattleData } = require('../controller/battle');
const router = express.Router();

router.post('/insertBattleProcess', async (req, res) => {
    const data = req.body;
    const result = await insertBattleProcess(data);
    console.log('insertBattleProcess result', result);
    if (result.error) {
        res.status(404).send('Insert error');
    } else res.send('Insert successfully');
});
router.post('/getBattleData', async (req, res) => {
    const data = req.body;
    const result = await findBattleData(data);
    if (result.error) {
        res.status(404).send('Not found');
    } else res.send(result);
});

module.exports = router;
