import mongoose from 'mongoose';

const CompSchema = new mongoose.Schema({
    name: String,
    characters: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
        default: Array(6).fill(null)
    },
    isDefense: {
        type: Boolean,
        required: true
    }
})

const StratSchema = new mongoose.Schema({
    lineup: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Lineup',
        required: true
    },
    map: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Map',
        required: true
    },
    comps: {
        type: [CompSchema],
        default: []
    },
    comments: {
        type: String,
        default: ''
    }
})


const Strat = mongoose.model('Strat', StratSchema);

export default { StratSchema, Strat }