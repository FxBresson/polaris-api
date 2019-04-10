import mongoose from 'mongoose';

const LineupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    objectives: String,
    planning: {
        defined: [false, false, false, false, false, false, false],
        doodle: {}
    },
});

const Lineup = mongoose.model('Lineup', LineupSchema);

export default { LineupSchema, Lineup }