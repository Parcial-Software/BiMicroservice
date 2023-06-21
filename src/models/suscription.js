const { Schema, model } = require('mongoose');

const SuscriptionSchema = Schema(
    {
        id_suscription: String,
        id_user: String,
        id_plan: String,
        fecha: Date,
    }, { timestamps: true }

);

SuscriptionSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Suscription', SuscriptionSchema);