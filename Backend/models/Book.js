const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    type: { type: String, enum: ['Book', 'Movie'], default: 'Book' },
    category: { type: String, default: 'General' },
    serialNo: { type: String, required: true, unique: true },
    status: { type: String, enum: ['Available', 'Issued'], default: 'Available' },
    cost: { type: Number, default: 0 },
    quantity: { type: Number, default: 1 },
    procurementDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);
