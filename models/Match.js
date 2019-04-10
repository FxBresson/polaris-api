import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    sr: Number,
    teamSr: Number,
    lineup: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Lineup',
        required: true
    },
    type: {
        type: String,
        enum: ['Scrim', 'Tournament', 'Ranked'],
        required: true
    },
    players: [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],
    result: [
        {
            map: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Map'
            },
            score: Number,
            enemyScore: Number
        }
    ],
    vod: [String],
    debrief: String
})

const Match = mongoose.model('Match', MatchSchema);


export default { MatchSchema, Match }