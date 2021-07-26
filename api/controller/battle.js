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
    console.log('findLatestProcess data', data);
    const cursor = await Battle.findLatest(data, { $orderby: { created_at: -1 } });
    console.log('findLatestProcess cursor', cursor);
    const latestDoc = await cursor.next();
    return latestDoc ? { error: false, data: latestDoc } : { error: true };
};

module.exports = {
    insertOneProcess,
    findLatestProcess,
};
