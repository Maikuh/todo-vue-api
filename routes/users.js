const express = require('express')
const User = require('../models/User')
const passport = require('passport')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const router = express.Router()

router.get('/logout', (req, res) => {
  req.logout();
  // req.flash('success', 'Successfully logged out');
  res.redirect('/api/users/login');
});

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json(req.user)
})

router.use('/', userNotAuth, (req, res, next) => {
  next()
})

router.get('/login', (req, res) => {
  res.json({
    message: 'something from login get'
  })
})

router.get('/register', (req, res) => {
  res.json({
    message: 'something from register get',
    success: 'User successfully registered'
  })
})

router.post('/register', (req, res) => {
  User.findOne({ username: req.body.username }, function (err, user) {
    if (err) console.log(err)    

    if (user) res.status(401).json({message: 'Username is already taken'})
    else {
      let newUser = new User()
      newUser.name = req.body.name
      newUser.username = req.body.username
      newUser.password = newUser.genHash(req.body.password)
      newUser.email = req.body.email

      newUser.save(err => {
        if (err) throw err
        res.json({
          newUser
        })
      })
    }
    // if (!user.verifyPassword(password)) 
    //   return done(null, false);
      
    // return done(null, user);
  })
})

router.post('/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password
    
    console.log(req.body);
    

    User.findOne({ username: username }, (err, user) => {      
      if (err) console.log(err)

      if (!user)
        res.status(401).json({message: 'Incorrect user or pass'})
      else {
        if (user.validatePass(password, user.password)) {
          let payload = {id: user.id}
          let token = jwt.sign(payload, process.env.SECRET_OR_KEY)
  
          res.json({message: 'ok', token})
        }
        else {
          res.status(401).json({message: 'Incorrect user or pass'})
        }
      }
    })    
})

function userNotAuth(req, res, next) {
  if (req.isUnauthenticated())
      return next();
  else {
      res.redirect('/api/todos')
  }
}

module.exports = router