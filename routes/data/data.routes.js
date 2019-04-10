// passport.authenticate middleware is used here to authenticate the request
import express from 'express';
import { getHeroes, getMaps } from './data.controller';
import { sendApiErrorResponse, sendApiSuccessResponse } from '../../services/response.service';
import overwatch from 'overwatch-api';
import {} from 'dotenv/config';
import { Player } from '../../models/index';



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
        overwatch.getProfile('pc', process.env.region, req.user.mainBtag.replace('#', '-'), (errP, jsonProfile) => {
            overwatch.getProfile('pc', process.env.region, req.user.mainBtag.replace('#', '-'), (errS, jsonStats) => {
                if (errP) return(errP);
                if (errS) return(errS)
                let updates = {
                    profile: {
                        level: jsonProfile.level,
                        portrait: jsonProfile.portrait,
                        endorsement: jsonProfile/endorsement,
                        rank: jsonProfile.competitive.rank,
                        rank_img: jsonProfile.competitive.rank_img,
                        levelFrame: jsonProfile.levelFrame,
                        levelStars: jsonProfile.star
                    },
                    lastStats: jsonStats
                };
            
                let options = {
                    new: true
                };

                Player.findByIdAndUpdate(req.user._id, updates, options, (err, player) => {
                    return res.json(player)
                })
            });
        });
    });


    return router;
}

export default dataRouter;