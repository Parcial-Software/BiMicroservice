const { Schema, model } = require('mongoose');

const UserSchema = Schema(
    {
        id_user: String,
        pais: String,
    }, { timestamps: true }

);

UserSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('User', UserSchema);