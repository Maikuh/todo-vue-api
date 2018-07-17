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
      // console.log('Payload received', payload);
      // console.log('User here', user)

      if (err) return done(err, null);

      if (!user) return done(null, false, {message: "User doesn't exist"})
        
      // if (!user.validatePass(req.body.password, user.password)) 
      //   return done(null, false, {message: 'Wrong password'});
      if (user && user.id == payload.id)
        return done(null, user)
    });
  }))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}