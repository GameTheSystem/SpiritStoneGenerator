'use strict';

const Router = require('express').Router();

Router.get('/exampleRoute', (req, res) => {
  res.send('blah');
});

module.exports = Router;
