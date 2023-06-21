const { Schema, model } = require('mongoose');

const FavoriteSchema = Schema(
    {
        id_user: String,
        id_song: String,
    }, { timestamps: true }

);

FavoriteSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Favorite', FavoriteSchema);