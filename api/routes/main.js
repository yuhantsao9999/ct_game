const express = require('express');
const router = express.Router();
const { find } = require('../controller/teamData');
// const { todayDate } = require('../utility/formatDate.utility');

const checkUserList = {
    ta: '/set',
    // teacher: `/grouping?date=${todayDate}`,
    teacher: `/select`,
    student: `/upload`,
};
router.post('/checkUser', async (req, res) => {
    try {
        let { userId } = req.body;
        if (userId === 'ta' || userId === 'teacher') {
            res.redirect(checkUserList[userId]);
        } else {
            const data = { body: { teamId: userId } };

            const result = await find(data);
            if (result.error) {
                //TODO:錯誤處理
                res.status(404).send('Not found');
            } else {
                // res.send(result.data);
                res.redirect(`/upload?userId=${userId}`);
            }
        }
    } catch (err) {
        return res.status(500);
    }
});

module.exports = router;
