import mongoose from 'mongoose';
import LineupSchema from './Lineup';

const staffMemberSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    role: String,
})

const TeamSchema = new mongoose.Schema({
    name: String,
    lineups: [LineupSchema],
    staffMembers: [staffMemberSchema]
});

export default TeamSchema