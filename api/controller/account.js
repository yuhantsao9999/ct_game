const mysql = require('../module/db');

const signIn = async (account) => {
    try {
        const { userId } = account;
        const sql = 'SELECT * FROM Users WHERE userId = ?';
        const result = await mysql.query(sql, userId).catch((err) => {
            console.log(err);
            return false;
        });
        console.log('result', result);
        if (result.length > 0) {
            const { activityName, teamName } = result[0];
            return { error: false, userId: userId, activityName: activityName, teamName: teamName };
        } else {
            return { error: true };
        }
    } catch (err) {
        return err;
    }
};

const checkActivityExist = async (activityName) => {
    try {
        const sql = 'SELECT * FROM Users WHERE activityName = ?';
        const result = await mysql.query(sql, activityName).catch((err) => {
            console.log(err);
            return false;
        });
        if (result.length > 0) {
            return { error: false, activityName: activityName };
        } else {
            return { error: true };
        }
    } catch (err) {
        return err;
    }
};

const insertNewUsers = async (account) => {
    try {
        const { teamID, teamName, activityName, uploadFileDeadline, game } = account;
        const insertUser = { userId: teamID, activityName: activityName, teamName: teamName, game: game };
        const sqlUser = 'INSERT INTO Users SET ?';
        const insertUserResult = await mysql.query(sqlUser, insertUser).catch((err) => {
            return { error: true };
        });

        const sqlFile = 'INSERT INTO File SET ?';
        const insertFile = { teamID: teamID, uploadFileDeadline: uploadFileDeadline, game: game };
        const insertFileResult = await mysql.query(sqlFile, insertFile).catch((err) => {
            return { error: true };
        });
        if (insertUserResult && insertFileResult) {
            return { error: false };
        }
    } catch (err) {
        return { error: true };
    }
};

module.exports = { signIn, checkActivityExist, insertNewUsers };
