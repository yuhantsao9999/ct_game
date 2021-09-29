const mysql = require('../module/db');
function roughSizeOfObject(object) {
    var objectList = [];
    var stack = [object];
    var bytes = 0;

    while (stack.length) {
        var value = stack.pop();

        if (typeof value === 'boolean') {
            bytes += 4;
        } else if (typeof value === 'string') {
            bytes += value.length * 2;
        } else if (typeof value === 'number') {
            bytes += 8;
        } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
            objectList.push(value);

            for (var i in value) {
                stack.push(value[i]);
            }
        }
    }
    return bytes;
}
const insertBattleProcess = async (teamData) => {
    try {
        const { activityName, playerA, playerB, process, winner, game } = teamData;
        console.log('typeof process', typeof process);
        console.log('roughSizeOfObject process', roughSizeOfObject(process));
        const sql = `INSERT INTO Battle (activityName, playerA, playerB, winner, process, game) VALUES ('${activityName}', '${playerA}', '${playerB}','${winner}','${process}','${game}') ON DUPLICATE KEY UPDATE process = '${process}', winner = '${winner}' `;
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
            return { error: false, process: JSON.parse(process, JSON), winner };
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
