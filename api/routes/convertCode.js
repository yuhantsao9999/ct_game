const express = require('express');
const { findCode } = require('../controller/convertPythonCode');
const router = express.Router();

router.post('/findOnePythonCode', async (req, res) => {
    const result = await findCode(req);
    console.log('result', result);
    if (result.error) {
        res.status(404).send('Not found');
    } else res.send(result.data);
});

module.exports = router;
