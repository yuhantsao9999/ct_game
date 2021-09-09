const mysql = require('../module/db');

const insertPythonCode = async (teamData) => {
    try {
        const { teamId, activityName, pythonCode } = teamData;
        const sql = `INSERT INTO Code (userId, activityName, pythonCode) VALUES ('${teamId}', '${activityName}', '${pythonCode}') ON DUPLICATE KEY UPDATE pythonCode = '${pythonCode}'`;
        const result = await mysql.query(sql).catch((err) => {
            console.log(err);
            return false;
        });
        if (result) {
            return { error: false };
        }
        return { error: true };
    } catch (err) {
        return err;
    }
};

const findPythonCode = async (teamData) => {
    try {
        const { teamName, activityName } = teamData;
        const sql = `SELECT pythonCode FROM Code NATURAL JOIN Users WHERE teamName = '${teamName}' and activityName = '${activityName}'`;
        const result = await mysql.query(sql).catch((err) => {
            console.log(err);
            return false;
        });
        if (result.length > 0) {
            const { pythonCode } = result[0];
            return { error: false, pythonCode };
        } else {
            return { error: true };
        }
    } catch (err) {
        return err;
    }
};

module.exports = {
    insertPythonCode,
    findPythonCode,
};
