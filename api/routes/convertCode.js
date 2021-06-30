const express = require('express');
const { findCode, insertOneCode } = require('../controller/convertPythonCode');
const router = express.Router();

router.post('/insertPythonCode', async (req, res) => {
    const result = await insertOneCode(req);
    if (result.error) {
        res.status(404).send('Insert error');
    } else res.send('Insert successfully');
});

router.post('/findOnePythonCode', async (req, res) => {
    const result = await findCode(req);
    if (result.error) {
        res.status(404).send('Not found');
    } else res.send(result.data);
});

module.exports = router;
