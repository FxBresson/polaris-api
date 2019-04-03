import mongoose from 'mongoose';

const MapSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    mapTypes: [String],
    thumbnail: String,
    flagUrl: String
});

const Map = mongoose.model('Map', MapSchema);


export default { MapSchema, Map }