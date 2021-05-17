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

module.exports = {
    insertOneCode,
};
