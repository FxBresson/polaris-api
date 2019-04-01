import mongoose from 'mongoose';
import { LineupSchema, PlayerSchema } from './index'

const staffMemberSchema = new mongoose.Schema({
    player: PlayerSchema,
    role: String,
})

const TeamSchema = new mongoose.Schema({
    name: String,
    lineups: [LineupSchema],
    staffMembers: []
});

export default TeamSchema