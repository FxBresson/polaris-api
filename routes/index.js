import express from 'express';
import passport from '../services/bnetStrategy.service'
import apiResponse from '../services/apiResponse.service'
import authRouter from './auth/auth.routes'

const mainRouter = express.Router();

mainRouter.use('/auth', authRouter({passport}))

mainRouter.get('/', (req, res) => {
    apiResponse(res, 'Home');
});


export default mainRouter
