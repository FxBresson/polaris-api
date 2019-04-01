import mongoose from 'mongoose';
import { MapSchema, CharacterSchema, PlayerSchema } from './index';

const CompSchema = new mongoose.Schema({
    phase: 'String',
    comp: [CharacterSchema]
})

const StratSchema = new mongoose.Schema({
    map: MapSchema,
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

export default LineupSchema