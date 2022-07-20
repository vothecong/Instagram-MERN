const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_PORT, MONGO_DB, MONGO_HOST } = process.env;

module.exports = {
    URI: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin&w=1`,
    KEY_SECRET: "DEMO",
    EMAIL: process.env.EMAIL,
    PASSWORD: process.env.PASSWORD
}