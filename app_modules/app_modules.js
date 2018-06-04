const config = require('../knexfile.js')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(config);
const bcrypt = require('bcryptjs');

  const getUserByEmail= (email,cb) => {
  return new Promise (function (resolve,reject) {

    resolve(
      knex('users')
        .where({email:email})
        .returning('*')
        .asCallback({cb})
    );
    reject("rejected");
  });
}

const insertUser = (email, password,cb) => {
  return new Promise (function (resolve,reject) {
    let passwordHash = bcrypt.hashSync(password, 10);
    resolve(
          knex('users')
      .insert({email, password: passwordHash})
      .returning('*')
      .asCallback({cb})
      );
    reject("rejected");
  });
}


module.exports = {getUserByEmail, insertUser}