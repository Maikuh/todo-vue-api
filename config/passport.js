const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/User')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY,
  passReqToCallback: true
}

module.exports = passport => {

  passport.use(new JwtStrategy(opts, (req, payload, done) => {
    User.findOne({_id: payload.id}, function(err, user) {
      console.log('Payload received', payload);
      console.log('User here', user)

      if (err) return done(err, null);

      if (!user) return done(null, false, {message: "User doesn't exist"})
        
      // if (!user.validatePass(req.body.password, user.password)) 
      //   return done(null, false, {message: 'Wrong password'});
      if (user && user.id == payload.id)
        return done(null, user)
    });
  }))

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