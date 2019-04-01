import mongoose from 'mongoose';
import { CharacterSchema } from './Character';
import { PlayerSchema } from './Player';

const CompSchema = new mongoose.Schema({
    phase: String,
    comp: [CharacterSchema]
})

const StratSchema = new mongoose.Schema({
    map: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Map'
    },
    comp: [CompSchema]
})

const OccurenceSchema = new mongoose.Schema({
    date: Date,
    type: {
        type: String,
        enum: ['Scrim', 'Tournament']
    },
    players: [PlayerSchema],
    result: {
        win: Boolean,
        winNb: Number,
        drawNb: Number,
        loseNb: Number 
    },
    vod: [String],
    debrief: String
})

const LineupSchema = new mongoose.Schema({
    name: String,
    description: String,
    objectives: String,
    players: [PlayerSchema],
    coachs: [PlayerSchema],
    planing: {
        defined: [],
        doodle: []
    },
    strats: [StratSchema],
    history: [OccurenceSchema]
});

const Lineup = mongoose.model('Lineup', LineupSchema);

export default { LineupSchema, Lineup }