import mongoose from 'mongoose';
import { RoleSchema } from './index';

const CharacterSchema = new mongoose.Schema({
    name: String,
    role: RoleSchema
});

export default CharacterSchema