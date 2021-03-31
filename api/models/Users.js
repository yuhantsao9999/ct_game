const Model = require('./Model');

class Users extends Model {}

Users._collection = 'users';

module.exports = Users;
