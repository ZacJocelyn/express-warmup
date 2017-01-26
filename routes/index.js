var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var knex = require('../db/knex');

router.get('/aliens', (req, res, next) => {
    return knex('probe')
    .then(probes =>{
      res.json(probes)
    })

});

router.get('/aliens/:id', function (req, res, next) {
  knex('probe').where('id', req.params.id).returning('*').then((data)=>{
    res.json(data)
  })
})

router.post('/aliens', (req, res, next) => {
    knex('probe')
    .insert({
      type: req.body.type,
      placement: req.body.placement,
      lights: req.body.lights,
      user_id: 1
    }).returning('*').then(probe=>{
      res.json(probe)
    })
});

router.delete('/aliens/:id', function (req, res, next) {
  knex('probe').where('id', req.params.id).del().returning('*').then((data)=>{
    res.json(data)
  })
})

router.put('/aliens/edit/:id', (req, res) =>{
    knex('probe').where('id', req.params.id).update({
        type: req.body.type,
        placement: req.body.placement,
        lights: req.body.lights,
        user_id: 1
    }).returning('*').then((data)=>{
      res.json(data)
    })
})

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
