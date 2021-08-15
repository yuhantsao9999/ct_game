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
    const { teamID, activityName, teamName, originalname, uploadFileDeadline } = req.body;
    const insertData = {
        activityName,
        teamName,
        teamId: teamID,
        uploadFileDeadline,
        originalname,
        game: '西瓜棋',
    };
    const doc = await Users.insertOne(insertData);
    return doc ? { error: false } : { error: true };
};

const findOne = async (req) => {
    const data = req.body;
    const cursor = await Users.find(data, { $orderby: { orderby: data.orderby } });
    const docArr = await cursor.next();
    return docArr ? { error: false, data: docArr } : { error: true };
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
    findOne,
    find,
};
