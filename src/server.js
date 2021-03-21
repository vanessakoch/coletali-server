const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const { errors } = require('celebrate');
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: 'https://your-app-name.herokuapp.com',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.options('*', cors());

app.use(routes);
app.use('/assets', express.static(path.resolve(__dirname, '..', 'assets')));
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(process.env.PORT || 3333);