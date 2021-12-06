const users = require('./users/users.service.js');
const messages = require('./messages/messages.service.js');
const engine = require('./engine/engine.service.js');
const tasks = require('./tasks/tasks.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(messages);
  app.configure(engine);
  app.configure(tasks);
};
