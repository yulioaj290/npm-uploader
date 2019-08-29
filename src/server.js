const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

dotenv.config();

// Set CORS options
const corsOptions = {
    origin: process.env.CORS_ORIGIN_HOST,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Applying CORS options
app.use(cors(corsOptions));

// Import Routes
const routes = require('./routes');

// Allow reading data sent in JSON format
app.use(express.json());

// Routes Middleware
app.use('/api/npm', routes);

app.listen(process.env.PORT || 4000, () => {
    console.log('Server Up and Running!')
});