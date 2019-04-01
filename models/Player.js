import mongoose from 'mongoose';
import { RoleSchema } from './index';

const BnetAccountSchema = new mongoose.Schema({
    btag: String,
    lastStats: {},
    decay: Number
})

const PlayerSchema = new mongoose.Schema({
    mainBtag: String,
    objectives: String,
    discordAccount: String,
    role: RoleSchema,
    bnetAccounts: [BnetAccountSchema]
});

export default PlayerSchema