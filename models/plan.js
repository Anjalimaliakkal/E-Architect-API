const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
        planRequestId: {
            type: mongoose.Schema.Types.ObjectId
        },
        architectId: {
            type: String,
            required: true
        },
        customer_id: {
            type: String,
            required: true
        },

        plotSize: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        budget: {
            type: String,
            required: true
        },
        timeline: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'pending',
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }
)
let planmodel = mongoose.model("plan", schema)
module.exports = planmodel