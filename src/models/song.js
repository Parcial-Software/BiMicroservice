const { Schema, model } = require('mongoose');

const SongSchema = Schema(
    {
        id_song: String,
        id_album: String,
        id_gender: String,
        name: String,
        reproductions: Number,
    }, { timestamps: true }

);

SongSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Song', SongSchema);