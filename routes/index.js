import express from 'express';
import passport from '../services/bnetStrategy.service'
import { sendApiSuccessResponse } from '../services/response.service';
import authRouter from './auth/auth.routes';
import dataRouter from './data/data.routes';
import graphlHTTP from 'express-graphql';
import graphqlSchema from '../graphql/graphqlSchema';

const mainRouter = express.Router();

mainRouter.use('/auth', authRouter({passport}));

mainRouter.use('/data', dataRouter({passport}));

mainRouter.use('/graphql', passport.authenticate('jwt', {session:false}), graphlHTTP((req, res, graphQLParams) => ({
  schema: graphqlSchema,
  graphiql: true,
  rootValue: {
    user: (request) => request.user._id
  }
})));

mainRouter.get('/', (req, res) => {
  return sendApiSuccessResponse(res, 'Home', {});
});


export default mainRouter
