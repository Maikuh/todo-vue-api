const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/User')
const bcrypt = require('bcryptjs')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY
}

module.exports = passport => {

  passport.use('jwt', new JwtStrategy(opts, (payload, done) => {
    User.findOne({id: jwt_payload.sub}, function(err, user) {
      if (err)
          return done(err, false);
      if (user)
          return done(null, user);
      else {
          return done(null, false);
          // or you could create a new account
      }
    });
  }))
  // passport.use('login', new LocalStrategy({
  //     usernameField: 'username',
  //     passwordField: 'password',
  //     passReqToCallback: true
  //   },
  //   function(req, username, password, done) {
  //     User.findOne({ username: username }, function (err, user) {
  //       if (err) return done(err);

  //       if (!user) return done(null, false, {message: "User doesn't exist"})
        
  //       if (!user.validatePass(password, user)) 
  //         return done(null, false, {message: 'Wrong password'});
          
  //       return done(null, user);
  //     });
  //   }
  // ));

  // passport.use('register', new LocalStrategy({
  //     passReqToCallback: true,
  //   },
  //   function(req, username, password, done) {
  //     req.checkBody('email', 'Email required').notEmpty()
  //     req.checkBody('email', 'Invalid Email').isEmail()
  //     req.checkBody('password', 'Invalid Password').isLength({min: 6})
      
  //     let errors = req.validationErrors()

  //     if (errors) {
  //       let messages = []
  //       errors.forEach(err => {
  //         messages.push(err.msg)
  //       })

  //       return done(null, false, req.flash('error', messages))
  //     }
  //     User.findOne({ username: username }, function (err, user) {
  //       if (err) return done(err);

  //       if (user) return done(null, false, {message: 'Username is already taken'})
  //       else {
  //         let newUser = new User()
  //         newUser.name = req.body.name
  //         newUser.username = username
  //         newUser.password = newUser.genHash(password)
  //         newUser.email = req.body.email

  //         newUser.save(err => {
  //           if (err) throw err
  //           return done(null, newUser)
  //         })
  //       }
  //       // if (!user.verifyPassword(password)) 
  //       //   return done(null, false);
          
  //       // return done(null, user);
  //     });
  //   }
  // ));

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}