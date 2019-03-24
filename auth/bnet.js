import passport from 'passport'
import BnetStrategy from 'passport-bnet'

import User from '../models/user'
import init from './init'

let BNET_ID = '8ed9985674d047e3a7cf808cf04ed028'
let BNET_SECRET = 'QmwZm74ToFBxE3N6461ts5lWeTBS6FAl'

passport.use(new BnetStrategy({
    clientID: BNET_ID,
    clientSecret: BNET_SECRET,
    callbackURL: "http://localhost:8080/auth/bnet/callback",
    region: "eu"
  },
  // linkedin sends back the tokens and progile info
  function(accessToken, refreshToken, profile, done) {

    var searchQuery = {
      battletag: profile.battletag
    };

    var updates = {
      battletag: profile.battletag,
      someID: profile.id
    };

    var options = {
      upsert: true
    };

    // update the user if s/he exists or add a new user
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if(err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });
  }

));

// serialize user into the session
init();


export default passport;