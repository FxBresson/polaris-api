import mongoose from 'mongoose';
import { LineupSchema } from './Lineup';

const staffMemberSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    role: String,
})

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    staffMembers: [staffMemberSchema]
});

const Team = mongoose.model('Team', TeamSchema);

export default { TeamSchema, Team }