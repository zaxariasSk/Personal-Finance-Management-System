require('dotenv').config();
const express = require('express');
const app = express();

const sequelize = require('./config/database');

const loginRoutes = require('./routes/loginRoutes');

app.use(express.json());

app.use(loginRoutes);

app.listen(process.env.PORT || 3000, async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    console.log('server is up and running in port: ' + process.env.PORT);
});