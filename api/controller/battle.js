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
    // const sortCursor = cursor.sort({ created_at: -1 });
    // console.log('sortCursor', sortCursor);
    while (cursor.hasNext()) {
        console.log('findLatestProcess', await cursor.next());
    }
    const latestDoc = await cursor.next();
    console.log('latestDoc', latestDoc);
    return latestDoc ? { error: false, data: latestDoc } : { error: true };
};

module.exports = {
    insertOneProcess,
    findLatestProcess,
};
