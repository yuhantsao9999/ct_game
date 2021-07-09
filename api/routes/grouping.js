const express = require('express');
const { find } = require('../controller/teamData');
const router = express.Router();

// router.get('/findAll', async (req, res) => {
//     const result = await find(req);
//     if (result.error) {
//         res.status(404).send('Not found');
//     } else res.send(result.data);
// });
router.post('/findTotalTeamNum', async (req, res) => {
    const result = await find(req);
    if (result.error) {
        res.status(404).send('Not found');
    } else res.send(result.data);
});

module.exports = router;
