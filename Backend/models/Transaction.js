const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    status: { 
        type: String, 
        enum: ['PendingIssue', 'ApprovedIssue', 'RejectedIssue', 'ReturnPending', 'Completed'], 
        default: 'PendingIssue' 
    },
    requestDate: { type: Date, default: Date.now },
    approvalDate: { type: Date },
    issueDate: { type: Date, required: true },
    expectedReturnDate: { type: Date, required: true },
    actualReturnDate: { type: Date },
    fineAmount: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false },
    remarks: { type: String }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
