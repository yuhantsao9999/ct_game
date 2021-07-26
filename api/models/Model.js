const mongodb = require('mongodb');
const R = require('ramda');
const { MongoClient } = mongodb;
require('dotenv').config();
const { DB_URI } = process.env;
let _client = null;

class Model {
    static async client() {
        if (!_client) {
            const options = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            };
            _client = await MongoClient.connect(DB_URI, options);
        }
        return _client;
    }
    static async db() {
        const client = await this.client();
        return client.db();
    }

    static async close() {
        const client = await this.client();
        return client.close();
    }

    static async collection() {
        const db = await this.db();
        return db.collection(this._collection);
    }

    static async insertOne(values = {}, options = {}) {
        const collection = await this.collection();
        const doc = {
            created_at: new Date(),
            updated_at: null,
            ...values,
        };
        const { insertedId: _id } = await collection.insertOne(doc, options);
        return { ...doc, _id };
    }

    static async find(query = {}, options = {}, callback = R.identity) {
        const collection = await this.collection();
        return collection.find(query, options);
    }

    static async findLatest(query = {}, options = {}, callback = R.identity) {
        const collection = await this.collection();
        return collection.find(query, options).limit(1);
    }

    static async updateOne(query = {}, updates = {}, options = {}) {
        const collection = await this.collection();
        const update = R.mergeDeepRight({ $currentDate: { updated_at: true } }, updates);
        const option = R.mergeDeepRight({ returnOriginal: false }, options);
        const { value } = await collection.findOneAndUpdate(query, update, option);
        return value;
    }
}

module.exports = Model;
