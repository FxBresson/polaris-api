import mongoose from 'mongoose';

const MapSchema = new mongoose.Schema({
    name: String
});

const Map = mongoose.model('Map', MapSchema);


export default { MapSchema, Map }