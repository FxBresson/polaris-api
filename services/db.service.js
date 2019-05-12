import mongoose from 'mongoose'
import {} from 'dotenv/config'


const initClient = () => {
    return new Promise( (resolve, reject) => {
        let mongoOptions = {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false
        }
        mongoose.connect(process.env.MONGO_URL, mongoOptions)
        var db = mongoose.connection;
        db.on('error', (err) => {
            reject("Mongoose default connection has occured "+err+" error");
        });
        db.once('open', () => {
            resolve( { db: db, url: process.env.MONGO_URL } )
        });
    })
}

export default { initClient }
