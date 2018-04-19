'use strict';

const app = require('express')();
const config = require('./config');
const pkg = require('./package');
const routes = require('./hub/routes');
const tasks = require('./tasks');
const models = require('./models');

// TODO Should loop through all tasks and set up an interval for it.
Object.keys(tasks).forEach((task) => {
  tasks[task].intervalId = setInterval(tasks[task].action, tasks[task].interval);
  // TODO Store the intervalId in case some hub action allows the manipulation of running tasks.
});

// Start up the hub
app.use('/', routes);
app.listen(config.hub.port, () => console.log(`${pkg.name} ${pkg.version} is running on port ${config.hub.port}`));
