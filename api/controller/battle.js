const Battle = require('../models/Battle');

const insertOneProcess = async (req) => {
    const { activityName, playerA, playerB, winner, process } = req.body;

    const insertData = {
        activityName,
        playerA,
        playerB,
        winner,
        process,
    };
    const doc = await Battle.insertOne(insertData);
    return doc ? { error: false } : { error: true };
};

const findLatestProcess = async (req) => {
    const data = req.body;
    const cursor = await Battle.find(data);
    // const latestDoc = await cursor.next();
    while (cursor.hasNext()) {
        console.log(await cursor.next());
    }
    // return latestDoc ? { error: false, data: latestDoc } : { error: true };
};

module.exports = {
    insertOneProcess,
    findLatestProcess,
};
