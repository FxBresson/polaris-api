// passport.authenticate middleware is used here to authenticate the request
import express from 'express';
import jwt from 'jsonwebtoken'

const authRouter = ({passport}) => {
    // Inject Passport to secure routes
    let router = express.Router();

    router.get('/bnet', (req, res, next) => {
            const authenticator = passport.authenticate('bnet', {
                scope: ['profile'], // Used to specify the required data
                state: Buffer.from(JSON.stringify(req.query)).toString('base64')
            })
            authenticator(req, res, next)
        }
    );
    
    // The middleware receives the data from Bnet and runs the function on Strategy config
    router.get('/bnet/callback', passport.authenticate('bnet'), (req, res) => {
        console.log('callback -------------------------------------------------------')
        // res.redirect('/secret')
        let state = JSON.parse(Buffer.from(req.query.state, 'base64').toString())
        let user = req._passport.session.user
        res.redirect(state.url+'?token=' + jwt.sign({user: user}, process.env.JWT_SECRET))
        // res.json({
        //     success: true,
        //     token: 'JWT ' + jwt.sign({user: user}, process.env.JWT_SECRET),
        //     user: user
        // })
        console.log('-------------------------------------------------------')
    });

    return router;
}

export default authRouter