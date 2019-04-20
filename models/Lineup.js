import mongoose from 'mongoose';

const LineupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    objectives: String,
    definedPlanning: [Boolean]
});

const Lineup = mongoose.model('Lineup', LineupSchema);

export default { LineupSchema, Lineup }