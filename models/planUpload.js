const mongoose = require('mongoose');
const uploadedPlanSchema = new mongoose.Schema({
    requirementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true,
    },
    planId: {
        type: String,
        required: true,
    },
    planFileUrl: {
        type: String,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    }
});

const UploadedPlan = mongoose.model('UploadedPlan', uploadedPlanSchema);
module.exports = UploadedPlan;
