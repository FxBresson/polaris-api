import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
    mainBtag: {
        type: String,
        required: true
    },
    bnetProfileId: String,
    objectives: String,
    discordAccount: String,
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    lineup: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Lineup',
    },
    status: {
        type: [String],
        enum: ['Player', 'Candidate', 'Captain', 'Coach', 'Staff']
    },
    profile: {
        level: Number,
        portrait: String,
        endorsement: {},
        rank: Number,
        rank_img: String,
        levelFrame: String,
        levelStars: String
    },
    lastStats: {}
});

const Player = mongoose.model('Player', PlayerSchema);

export default { PlayerSchema, Player }