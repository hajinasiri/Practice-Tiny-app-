const config = require('../knexfile.js')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(config);
const bcrypt = require('bcryptjs');

//|===================================================
//|users TABLE Modules
//|===================================================
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


//|===================================================
//|urls Table Modules
//|===================================================

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

const insertUrl = (short_url, long_url,id,cb) => {
  return new Promise (function (resolve,reject) {
    resolve(
      knex('urls')
        .insert({user_id:id, long_url:long_url, short_url: short_url})
        .returning('*')
        .asCallback({cb})
    );
    reject('rejected');
  })
}

const getUrlByShortUrl = (id,short_url, long_url,cb) => {
  return new Promise (function (resolve, reject) {
    resolve(
      knex('urls')
        .where({user_id:id, short_url:short_url})
        .update({long_url:long_url})
        .returning('*')
        .asCallback({cb})
      );
    reject('rejected');
  })
}



module.exports = {getUserByEmail, insertUser, getUrlsByUserId, getUserById, insertUrl, getUrlByShortUrl}