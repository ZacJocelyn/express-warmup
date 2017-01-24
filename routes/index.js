var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var knex = require('../db/knex');

function validUser(user) {
  var validEmail = typeof user.email == 'string' &&
                    user.email.trim() != '';
  var validPassword = typeof user.password == 'string' &&
                    user.password.trim() != '' &&
                    user.password.length >= 6;
  return validEmail && validPassword;
}

router.post('/auth/login', function(req, res, next) {
  if(validUser(req.body)) {
    return knex('user').where('email', req.body.email).first()
    .then(function(user) {
      console.log(user);
      console.log(req.body.password);
      if(bcrypt.compareSync(req.body.password, user.password)) {

        res.json({message: 'good'})

    } else {
       next(new Error('Invalid Signin'))
    }})

  } else {
    next(new Error('Invalid Input'))
  }
})

router.post('/auth/signup', function(req, res, next) {
  if(validUser(req.body)) {
    return knex('user').where('email', req.body.email).first()
    .then(function(user) {
      if(!user) {
        bcrypt.hash(req.body.password, 8)
        .then(function(hash) {
          var user = {
            email: req.body.email,
            password: hash
          }
          return knex('user').insert(user, 'id')
          .then(function(id){

            res.json({ id, message: 'nice' })
          })
        })
      } else {
          next(new Error('Email in use'))
      }
    })
  } else {
    next(new Error('Invalid Input'))
  }
})
module.exports = router;
