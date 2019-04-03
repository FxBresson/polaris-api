import mongoose from 'mongoose';

const MatchSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    lineup: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Lineup'
    },
    type: {
        type: String,
        enum: ['Scrim', 'Tournament', 'Ranked'],
        required: true
    },
    players: [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}],
    result: {
        win: Boolean,
        winNb: Number,
        drawNb: Number,
        loseNb: Number 
    },
    vod: [String],
    debrief: String
})

const Match = mongoose.model('Match', MatchSchema);


export default { MatchSchema, Match }