const config = require('../knexfile.js')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(config);
const bcrypt = require('bcryptjs');

//===================================================
//users TABLE Modules
//===================================================
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

const getUserById = (id,cb) => {
  return new Promise (function (resolve, reject) {
    resolve(
      knex('users')
        .where({id:id})
        .returning('*')
        .asCallback({cb})
      );
    reject('rejected');
  })
}

const getUrlsByUserId = (id,cb) => {
  return new Promise (function (resolve, reject) {
    resolve(
      knex('urls')
        .where({user_id:id})
        .returning('*')
        .asCallback({cb})
      );
    reject('rejected');
  })
}

//===================================================
//urls TABLE Modules
//===================================================





module.exports = {getUserByEmail, insertUser, getUrlsByUserId, getUserById}