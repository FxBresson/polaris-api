// Config
import {} from 'dotenv/config'

// Passeport
import passport from 'passport'
import BnetStrategy from 'passport-bnet'
import { Strategy as JwTStrategy, ExtractJwt } from 'passport-jwt'

// Models
import { Player } from '../models/index'

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

  let searchQuery = {
    mainBtag: profile.battletag
  };

  let updates = {
    bnetProfileId: profile.id,
  };

  let options = {
    new: true
  };

  // update the user if s/he exists or add a new user
  Player.findOneAndUpdate(searchQuery, updates, options, (err, user) => {
    if(err) {
      return done(err);
    } else {
      let userObj = (({ _id }) => ({ _id }))(user)
      return done(null, userObj);
    }
  });
}

));

passport.use(new JwTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: process.env.JWT_SECRET,
  ignoreExpiration: true,
}, (jwt_payload, done) => {
  if (jwt_payload.bot) {
    return done(null, {bot: true})
  }
  if(jwt_payload.user && jwt_payload.user._id) {
    Player.findById(jwt_payload.user._id, (err, user) => {
      if (err) {
          return done(err, false)
      }
      if (user) {
          return done(null, user)
      } else {
          return done(null, false)
      }
    });
  } else {
    return done({err: 'No user'}, false)
  }
}));

// Used to stuff a piece of information into a cookie
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// Used to decode the received cookie and persist session
// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

export default passport;