const express = require('express');
const routes = require('./routes');
const path = require('path');
const cors = require('cors');
const { errors } = require('celebrate');
require("dotenv").config();

const app = express();

conf = {
  originUndefined: function (req, res, next) {
    if (!req.headers.origin) {
      res.json({
        mess: 'Hi you are visiting the service locally. If this was a CORS the origin header shoud not be undefined'
      });
    } else {
      next();
    }
  },

  cors: {
    origin: function (origin, cb) {
      let wl = ['http://192.168.2.112:3333', 'https://coletali-server.herokuapp.com/'];
      
      if (wl.indexOf(origin) != -1) {
        cb(null, true);
      } else {
        cb(new Error('invalid origin: ' + origin), false);
      }
    },
    optionsSuccessStatus: 200
  }
};

app.use(express.json());
app.use(conf.originUndefined, cors(conf.cors));

app.use(routes);
app.use('/assets', express.static(path.resolve(__dirname, '..', 'assets')));
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors());

app.listen(process.env.PORT || 3333, function () {
  console.log("Server listening on port %d in %s mode", this.address().port, app.settings.env);
});