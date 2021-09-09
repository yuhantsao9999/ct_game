const mysql = require('../module/db');

const checkUploadDeadline = async (teamId) => {
    try {
        const sql = 'SELECT uploadFileDeadline FROM File WHERE teamId = ?';
        const result = await mysql.query(sql, teamId).catch((err) => {
            console.log(err);
            return false;
        });
        if (result.length > 0) {
            const { uploadFileDeadline } = result[0];
            return { error: false, uploadFileDeadline };
        } else {
            return { error: true };
        }
    } catch (err) {
        return err;
    }
};

const uploadFileName = async (file, data) => {
    try {
        const { teamId } = data;
        const { originalname } = file;
        const sql = `UPDATE File SET fileName = '${originalname}' WHERE teamId = ${teamId}`;
        const result = await mysql.query(sql).catch((err) => {
            console.log(err);
            return false;
        });
        if (result) {
            return { error: false };
        }
        return { error: true };
    } catch (err) {
        return { error: true };
    }
};

module.exports = { checkUploadDeadline, uploadFileName };
