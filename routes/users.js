const express = require('express')
const User = require('../models/User')
const passport = require('passport')
const bcrypt = require('bcryptjs');

const router = express.Router()

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Successfully logged out');
  res.redirect('/api/users/login');
});

router.get('/profile', (req, res) => {
  res.json({
    user: req.user,
    message: 'User successfully logged in or registered'
  })
})

router.use('/', userNotAuth, (req, res, next) => {
  next()
})

router.get('/login', (req, res) => {
  res.json({
    message: req.flash('error')
  })
})

router.get('/register', (req, res) => {
  res.json({
    message: req.flash('error'),
    success: 'User successfully registered'
  })
})

router.post('/register', passport.authenticate('register', {
  successRedirect: '/api/users/profile',
  failureRedirect: '/api/users/register',
  failureFlash: true}),
  (req, res) => {
    res.json({
      user: req.user
    })
  })

router.post('/login', passport.authenticate('login', {
  successRedirect: '/api/users/profile',
  failureRedirect: '/api/users/login',
  failureFlash: true}),
  (req, res) => {
    
})

function userNotAuth(req, res, next) {
  if (req.isUnauthenticated())
      return next();
  else {
      req.flash('error', "You're already logged in")
      res.redirect('/api/todos')
  }
}

module.exports = router