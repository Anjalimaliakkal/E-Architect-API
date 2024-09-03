const mongoose = require('mongoose')
const Schema = new mongoose.Schema(
    {

    customer_id: {
        type: String,
        required: true
    },
    architectId: {
        type: String,
        required: true
    },
    planRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'pending' // Status could be 'pending', 'paid', or 'rejected'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const PaymentRequestmodel = mongoose.model("PaymentRequest", Schema)
module.exports = PaymentRequestmodel
