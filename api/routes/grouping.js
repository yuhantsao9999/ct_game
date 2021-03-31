const express = require('express');
const { find } = require('../controller/teamData');
const router = express.Router();

router.post('/findOrderByDate', async (req, res) => {
    const date = req.body;
    const result = await find(date);
    if (result.error) {
        res.status(404).send('Not found');
    } else res.send(result.data);
});


router.get('/findAll', async (req, res) => {
    const result = await find(req);
    if (result.error) {
        res.status(404).send('Not found');
    } else res.send(result.data);
});

module.exports = router;
