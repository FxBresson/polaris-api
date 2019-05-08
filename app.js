// Required dependencies 
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'

import mainRouter from './routes'

import {} from 'dotenv/config'

import passport from './services/bnetStrategy.service'

import mongoDB from './services/db.service'

import updateDoodle from './services/updateDoodle.service'

import schedule from 'node-schedule';

const app = express();
const port = process.env.PORT;


// app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(passport.initialize()); // Used to initialize passport

app.use(express.static('public'))
// Routes
app.use('/', mainRouter)


mongoDB.initClient()
.then( db => {
    app.listen(port, () => console.log(`Server is running on port ${port}`))

    const cron_updateSchedule = schedule.scheduleJob('0 0 * * 1', updateDoodle)
})
.catch( mongooseError => console.log(mongooseError));
