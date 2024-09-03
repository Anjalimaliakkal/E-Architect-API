const mongoose = require('mongoose')
const Schema = mongoose.Schema(
    {
        planRequestId: {
            type: mongoose.Schema.Types.ObjectId,
            //ref: 'Plan',
            required: true
        },
        architectId: {
            type: String,
            required: true
        },
        planFileUrl: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        }
    });

const UploadedPlanmodel = mongoose.model("UploadedPlan", Schema)
module.exports = UploadedPlanmodel
