require('dotenv').config({path: __dirname + '\\.env'});
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

const sequelize = require('./config/database');
const errorHandlerMiddleware = require('./middleware/error-handler');

require('./config/relationships');
const loginRoutes = require('./routes/loginRoutes');
const incomeRoutes = require('./routes/incomeRoutes');

app.use(cookieParser());
app.use(express.json());

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3006');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', "true");
    next();
});

app.use('/auth', loginRoutes);
app.use(incomeRoutes);

app.use(errorHandlerMiddleware);

app.listen(process.env.PORT || 3000, async () => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({force: true});
        await sequelize.sync();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    console.log('server is up and running in port: ' + process.env.PORT);
});