const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNo: { type: String, minlength: 10, maxlength: 10, default: '' },
    address: { type: String, default: '' },
    aadharNo: { type: String, required: true, unique: true, minlength: 12, maxlength: 12 },
    membershipType: { type: String, enum: ['6 months', '1 year', '2 years'], default: '6 months' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    amountPending: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    role: { type: String, enum: ['Admin', 'Member'], default: 'Member' },
    password: { type: String, required: true }
});

module.exports = mongoose.model('Member', MemberSchema);
