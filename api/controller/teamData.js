const mysql = require('../module/db');

const getTotalTeamNum = async (activityData) => {
    try {
        const { activityName } = activityData;
        const sql = 'SELECT userId FROM USERS WHERE activityName = ?';
        const userList = await mysql.query(sql, activityName).catch((err) => {
            console.log(err);
            return false;
        });
        if (userList.length > 0) {
            const totalTeamNumber = userList.length;
            return { error: false, totalTeamNumber: totalTeamNumber };
        } else {
            return { error: true };
        }
    } catch (err) {
        return err;
    }
};

module.exports = {
    getTotalTeamNum,
};
