// passport.authenticate middleware is used here to authenticate the request
import express from 'express';
import jwt from 'jsonwebtoken';

import { sendUnauthorizedErrorResponse, sendApiSuccessResponse } from '../../services/response.service'

const authRouter = ({passport}) => {
    // Inject Passport to secure routes
    let router = express.Router();

    router.get('/getbottoken', passport.authenticate('jwt', {session:false}), (req, res) => {
        let token = jwt.sign({bot: true}, process.env.JWT_SECRET)
        return sendApiSuccessResponse(res, 'Bot token provided', {token: token})
    })

    router.get('/bnet', (req, res, next) => {
        const authenticator = passport.authenticate('bnet', {
            scope: ['profile'], // Used to specify the required data
            state: Buffer.from(JSON.stringify(req.query)).toString('base64')
        })
        authenticator(req, res, next)
    });

    router.get('/bnet/callback', (req, res, next) => {
        passport.authenticate('bnet', (err, user, info) => {
            let state = JSON.parse(Buffer.from(req.query.state, 'base64').toString())
            
            if (err || !user) {
                if (state && state.url && state.useCookie) {
                    res.cookie('token', false, {domain: '.polaris.team'})
                    return res.redirect(`${state.url}`)
                } else if (state && state.url) {
                    return res.redirect(`${state.url}?unauthorized=true`)
                } else {
                    return sendUnauthorizedErrorResponse(res, 'User not in DB', err)
                }
            } else {
                let token = jwt.sign({user: user}, process.env.JWT_SECRET);
                if (state && state.url && state.useCookie) {
                    res.cookie('token', token, {domain: '.polaris.team'})
                    return res.redirect(`${state.url}`)
                } else if (state && state.url) {
                    return res.redirect(`${state.url}?token=${token}`)
                } else {
                    return sendApiSuccessResponse(res, 'Login', {token: token, user: user})
                }
            }
        })(req, res, next);
    });

    return router;
}

export default authRouter;