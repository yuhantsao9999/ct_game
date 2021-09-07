const express = require('express');
const router = express.Router();
const { signIn } = require('../controller/account');

router.post('/signIn', async (req, res) => {
    try {
        let { userId } = req.body;
        if (userId === 'ta' || userId === 'teacher') {
            res.send({ userId });
        } else {
            const data = req.body;
            const result = await signIn(data);
            if (result.error) {
                res.status(404).send('查無此使用者');
            } else {
                res.send(result);
            }
        }
    } catch (err) {
        return res.status(500);
    }
});

module.exports = router;
