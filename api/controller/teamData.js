const Users = require('../models/Users');

const uploadFile = async (req) => {
    const { teamId } = JSON.parse(req.body.data);
    const { originalname } = req.file;
    const updateData = {
        code_id: teamId + '-' + new Date().getTime(),
        originalname,
    };
    const doc = await Users.updateOne({ teamId }, { $set: updateData });
    return doc ? { error: false } : { error: true };
};
const insertOne = async (req) => {
    const { teamID, activityName, teamName, originalname } = req.body;
    const insertData = {
        activityName,
        teamName,
        teamId: teamID,
        originalname,
        game: '西瓜棋',
    };
    const doc = await Users.insertOne(insertData);
    return doc ? { error: false } : { error: true };
};

const findLatest = async (req) => {
    const data = req.body;
    const cursor = await Users.find(data, { $orderby: { created_at: -1 } });
    const latestDoc = await cursor.next();
    return latestDoc ? { error: false, data: latestDoc } : { error: true };
};

const findActivityName = async (req) => {
    const data = req.body;
    const { activityName } = req.body;
    const cursor = await Users.find(data, { $orderby: { activityName: activityName } });
    const latestDoc = await cursor.next();
    return latestDoc ? { error: false, data: latestDoc } : { error: true };
};

const find = async (req) => {
    const data = req.body;
    const cursor = await Users.find(data);
    const docArr = await cursor.toArray();
    return docArr.length > 0 ? { error: false, data: docArr } : { error: true };
};

module.exports = {
    uploadFile,
    insertOne,
    findLatest,
    findActivityName,
    find,
};
