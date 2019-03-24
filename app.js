// Required dependencies 
import express from 'express'
import passport from 'passport'
import BnetStrategy from 'passport-bnet'
import mongoose from 'mongoose'
import User from './models/user'
import cors from 'cors'
import bodyParser from 'body-parser'

import dotenv from 'dotenv'
dotenv.config()

import jwt from 'jsonwebtoken'
import { Strategy as JwTStrategy, ExtractJwt } from 'passport-jwt'

const app = express();


mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())


app.use(passport.initialize()); // Used to initialize passport

// Strategy config
passport.use(new BnetStrategy({
    clientID: process.env.BNET_ID,
    clientSecret: process.env.BNET_SECRET,
    callbackURL: "https://polarisapi.serveo.net/auth/bnet/callback",
    region: "eu",
    // passReqToCallback: true
  },
  // bnet sends back the tokens and progile info
  function(accessToken, refreshToken, profile, done) {

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
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
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

function apiResponse(res, message) {
    res.json({
        message: message
    })
}

// Middleware to check if the user is authenticated
function isUserAuthenticated(req, res, next) {
    // if (req.user) {
    //     next();
    // } else {
    //     apiResponse(res, 'You must login!');
    // }
    // next()



}

// Routes
app.get('/', (req, res) => {
    apiResponse(res, 'Home');
});


// passport.authenticate middleware is used here to authenticate the request
app.get('/auth/bnet',
    (req, res, next) => {
        const authenticator = passport.authenticate('bnet', {
            scope: ['profile'], // Used to specify the required data
            state: Buffer.from(JSON.stringify(req.query)).toString('base64')
        })
        authenticator(req, res, next)
    }
);



// The middleware receives the data from Google and runs the function on Strategy config
app.get('/auth/bnet/callback', passport.authenticate('bnet'), (req, res) => {
    console.log('callback -------------------------------------------------------')
    // res.redirect('/secret')
    console.log(req.query)
    let state = JSON.parse(Buffer.from(req.query.state, 'base64').toString())
    console.log(state)
    let user = req._passport.session.user
    res.redirect(state.url+'?token=JWT ' + jwt.sign({user: user}, process.env.JWT_SECRET))
    // res.json({
    //     success: true,
    //     token: 'JWT ' + jwt.sign({user: user}, process.env.JWT_SECRET),
    //     user: user
    // })
    console.log('-------------------------------------------------------')
});

// Secret route
app.get('/secret', passport.authenticate('jwt', {session:false}, isUserAuthenticated), (req, res) => {
    apiResponse(res, 'You have reached the secret route');
});
// Profile route
app.get('/profile', passport.authenticate('jwt', {session:false}, isUserAuthenticated), (req, res) => {
    apiResponse(res, req.user);
});


app.listen(8080, () => {
    console.log('Server Started!');
});