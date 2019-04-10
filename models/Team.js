import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Team = mongoose.model('Team', TeamSchema);

export default { TeamSchema, Team }