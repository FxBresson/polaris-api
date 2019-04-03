import mongoose from 'mongoose';

const CompSchema = new mongoose.Schema({
    phase: String,
    comp: [{type: mongoose.Schema.Types.ObjectId, ref: 'Character' }]
})

const StratSchema = new mongoose.Schema({
    map: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Map',
        required: true
    },
    comp: [CompSchema],
    comments: String
})


const Strat = mongoose.model('Strat', StratSchema);

export default { StratSchema, Strat }