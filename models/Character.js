import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema({
    name: String,
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }
});

export default CharacterSchema