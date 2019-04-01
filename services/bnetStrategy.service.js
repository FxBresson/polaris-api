// Config
import {} from 'dotenv/config'

// Passeport
import passport from 'passport'
import BnetStrategy from 'passport-bnet'
import { Strategy as JwTStrategy, ExtractJwt } from 'passport-jwt'

// Models
import User from '../models/user'


// Strategy config
passport.use(new BnetStrategy({
  clientID: process.env.BNET_ID,
  clientSecret: process.env.BNET_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/bnet/callback`,
  region: process.env.REGION,
  // passReqToCallback: true
},
// bnet sends back the tokens and profile info
(accessToken, refreshToken, profile, done) => {

  var searchQuery = {
    battletag: profile.battletag
  };

  var updates = {
    battletag: profile.battletag,
    profileId: profile.id,
    token: accessToken
  };

  var options = {
    upsert: true,
    new: true
  };

  // update the user if s/he exists or add a new user
  User.findOneAndUpdate(searchQuery, updates, options, (err, user) => {
    if(err) {
      return done(err);
    } else {
      return done(null, user);
    }
  });
}

));

passport.use(new JwTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET,
  ignoreExpiration: true,
}, (jwt_payload, done) => {
  User.findById(jwt_payload._doc._id, (err, user) => {
      if (err) {
          return done(err, false)
      }
      if (user) {
          return done(null, user)
      } else {
          return done(null, false)
      }
  });
}));

// Used to stuff a piece of information into a cookie
passport.serializeUser((user, done) => {
  done(null, user);
});

// Used to decode the received cookie and persist session
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;