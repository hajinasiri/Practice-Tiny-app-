const settings = require("./settings");

module.exports = {

  development: {
    client: 'pg',
    connection: {
      user     : settings.user,
      password : settings.password,
      database : settings.database,
      host     : settings.hostname,
      port     : settings.port
    }
  }
};
