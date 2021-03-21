const express = require('express');
const routes = require('./routes');
const path = require('path');
const cors = require('cors');
const { errors } = require('celebrate');
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);
app.use('/assets', express.static(path.resolve(__dirname, '..', 'assets')));
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(process.env.PORT || 3333);