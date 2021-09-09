const mysql = require('../module/db');

const insertBattleProcess = async (teamData) => {
    try {
        const { activityName, playerA, playerB, process, winner, game } = teamData;
        const sql = `INSERT INTO Battle (activityName, playerA, playerB, winner, process, game) VALUES ('${activityName}', '${playerA}', '${playerB}','${winner}','${JSON.stringify(
            process
        )}','${game}') ON DUPLICATE KEY UPDATE process = '${process}' AND winner = '${winner}' `;
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

const findBattleData = async (teamData) => {
    try {
        const { activityName, playerA, playerB, game } = teamData;
        const sql = `SELECT * FROM Battle WHERE activityName = '${activityName}' AND playerA = '${playerA}' AND playerB='${playerB}' AND game='${game}'`;
        const result = await mysql.query(sql).catch((err) => {
            console.log(err);
            return false;
        });
        if (result) {
            const { process, winner } = result[0];
            return { error: false, process: JSON.parse(process), winner };
        } else {
            return { error: true };
        }
    } catch (err) {
        return err;
    }
};

module.exports = {
    insertBattleProcess,
    findBattleData,
};
