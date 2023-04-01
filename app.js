const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cors = require('cors');
const routerApi = require('./routes');
const { boomErrorFormat, logs, sendError } = require('./middleware/errorHandler');

const ALLOWED_ORIGINS = ['http://localhost:3000'];

const app = express();
    
app.use(helmet());

app.use(cors({
    origin: function(origin, callback){
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.indexOf(origin) === -1) {
            const message = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));
app.use(express.static("client"));
app.use(bodyParser.urlencoded({ extended: true }));

routerApi(app);

app.use(logs);
app.use(boomErrorFormat);
app.use(sendError);

module.exports = app;