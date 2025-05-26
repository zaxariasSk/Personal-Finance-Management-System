const {Sequelize} = require('sequelize');
const path = require("path");
const fs = require("fs");

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialectOptions: {
        ssl: {
            ca: fs.readFileSync(path.resolve(__dirname, '../certs/ca.pem')),
            rejectUnauthorized: true, // ensure certificate is verified
        }
    },
    dialect: 'mysql'
});

module.exports = sequelize;