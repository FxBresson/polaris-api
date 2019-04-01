import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema({
    name: String,
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    }
});

const Character = mongoose.model('Character', CharacterSchema);

export { CharacterSchema, Character }