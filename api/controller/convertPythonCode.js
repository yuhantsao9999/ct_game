const Code = require('../models/PythonCode');

const insertOneCode = async (req) => {
    const { teamId, activityName, teamName, pythonCode } = req.body;
    const insertData = {
        teamId,
        activityName,
        teamName,
        pythonCode,
    };
    const doc = await Code.insertOne(insertData);
    return doc ? { error: false } : { error: true };
};
const findLatestCode = async (req) => {
    const data = req.body;
    console.log('data', data);
    const doc = await Code.find(data,{ $orderby: { teamName: teamName } };
    const latestDoc = await doc.next();
    return latestDoc ? { error: false, data: latestDoc } : { error: true };
};

module.exports = {
    insertOneCode,
    findLatestCode,
};
