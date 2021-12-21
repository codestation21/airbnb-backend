const express = require('express');
const cors = require('cors');
const {join} = require('path');
const {stripeWebhook} = require('./Express/webhook');

const app = express();
app.use(express.static(join(__dirname, './Upload')));
app.use(cors());
app.use('/webhook', express.raw({type: 'application/json'}), stripeWebhook);
app.use(express.json());
module.exports = app;