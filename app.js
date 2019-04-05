// Required dependencies 
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'

import mainRouter from './routes'

import {} from 'dotenv/config'

import passport from './services/bnetStrategy.service'

import mongoDB from './services/db.service';

const app = express();
const port = process.env.PORT;


app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(passport.initialize()); // Used to initialize passport

// Routes
app.use('/', mainRouter)


mongoDB.initClient()
.then( db => {
    app.listen(port, () => console.log(`Server is running on port ${port}`))
})
.catch( mongooseError => console.log(mongooseError));
