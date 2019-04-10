import mongoose from 'mongoose';

const CompSchema = new mongoose.Schema({
    name: String,
    comp: [{type: mongoose.Schema.Types.ObjectId, ref: 'Character' }]
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
    compAttack: [CompSchema],
    compDefense: [CompSchema],
    comments: String
})


const Strat = mongoose.model('Strat', StratSchema);

export default { StratSchema, Strat }