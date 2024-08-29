const mongoose = require("mongoose")
const schema = mongoose.Schema(
    {
        planId: {
            type: mongoose.Schema.Types.ObjectId
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
        date: {
            type: Date,
            default: Date.now
        }
    }
)
let planmodel = mongoose.model("plan", schema)
module.exports = planmodel