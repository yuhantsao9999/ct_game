const express = require('express');
const router = express.Router();
const { find, findTeamName } = require('../controller/teamData');

router.post('/checkUser', async (req, res) => {
    try {
        let { userId } = req.body;
        if (userId === 'ta' || userId === 'teacher') {
            res.send({ userId });
        } else {
            const data = { body: { teamId: userId } };
            const result = await find(data);
            if (result.error) {
                res.status(404).send('查無此使用者');
            } else {
                res.send({ userId });
                // res.redirect(`/upload?userId=${userId}`);
            }
        }
    } catch (err) {
        return res.status(500);
    }
});

router.post('/findTeamName', async (req, res) => {
    const result = await findTeamName(req);
    if (result.error) {
        res.status(404).send('Not found');
    } else {
        res.send(result.data);
    }
});

module.exports = router;
