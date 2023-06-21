const { Schema, model } = require('mongoose');

const GenderSchema = Schema(
    {
        id_gender: String,
        name: String,
    }, { timestamps: true }

);

GenderSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Gender', GenderSchema);