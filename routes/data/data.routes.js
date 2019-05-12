// passport.authenticate middleware is used here to authenticate the request
import express from 'express';
import { getHeroes, getMaps } from './data.controller';
import { sendApiErrorResponse, sendApiSuccessResponse } from '../../services/response.service';
import {} from 'dotenv/config';



const dataRouter = ({passport}) => {
    // Inject Passport to secure routes
    let router = express.Router();

    //Update game data
    router.get('/ow', async (req, res, next) => {
        try {
            await getMaps();
            await getHeroes();
        } catch(err) {
            return sendApiErrorResponse(res, 'failed', err);
        }
        return sendApiSuccessResponse(res, 'success', null);
    });

    router.get('/player', passport.authenticate('jwt', {session:false}), (req, res, next) => {
        
    });


    return router;
}

export default dataRouter;