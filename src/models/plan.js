const { Schema, model } = require('mongoose');

const PlanSchema = Schema(
    {
        id_plan: String,
        name: String,
        price: Number,
    }, { timestamps: true }

);

PlanSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

module.exports = model('Plan', PlanSchema);