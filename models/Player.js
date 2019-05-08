import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
    mainBtag: {
        type: String,
        required: true,
        unique: true
    },
    lineup: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Lineup',
        required: true
    },
    status: {
        type: [String],
        enum: ['Player', 'Candidate', 'Captain', 'Coach', 'Staff', 'Founder'],
        required: true
    },
    doodle: {
        type: [Number],
        default: Array(14).fill(0, 0, 14)
    },
    bnetProfileId: String,
    objectives: String,
    discordAccount: String,
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    profile: {
        level: Number,
        portrait: String,
        endorsement: {},
        rank: [{
            date: Date,
            srValue: Number
        }],
        rank_img: String,
        levelFrame: String,
        levelStars: String
    },
    lastStats: {},
    defaultAvailability: {
        type: Number,
        default: 0
    }
});

const Player = mongoose.model('Player', PlayerSchema);

export default { PlayerSchema, Player }