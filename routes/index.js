var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
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
      if(user) {
        bcrypt.compare(req.body.password, user.password, function() {
          res.json({
            id: user.id,
            message: "Signed In! 🔓"
          })
      })
    } else {
       next(new Error('Invalid Signin'))
    }})

  } else {
    next(new Error('Invalid Input'))
  }
})

module.exports = router;
