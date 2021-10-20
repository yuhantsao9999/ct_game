const pages = {
    upload: require('./routes/upload'),
    grouping: require('./routes/grouping'),
    set: require('./routes/set'),
    main: require('./routes/main'),
    improve: require('./routes/improve'),
};

const publicApi = {
    convertCode: require('./routes/convertCode'),
    battleProcess: require('./routes/battleProcess'),
};
module.exports = {
    pages,
    publicApi,
};
