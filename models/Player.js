import mongoose from 'mongoose';

const BnetAccountSchema = new mongoose.Schema({
    btag: String,
    lastStats: {},
    decay: Number
})

const PlayerSchema = new mongoose.Schema({
    mainBtag: String,
    bnetProfileId: String,
    token: String,
    objectives: String,
    discordAccount: String,
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    bnetAccounts: [BnetAccountSchema]
});

const Player = mongoose.model('Player', PlayerSchema);

export default { PlayerSchema, Player }