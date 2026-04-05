const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Member = require('../models/Member');

exports.requestIssue = async (req, res) => {
    try {
        const { bookId, memberId, issueDate, expectedReturnDate, remarks } = req.body;
        const requesterId = req.headers['x-user-id'];
        if (!requesterId) return res.status(401).json({ message: "Authentication required." });
        
        const requester = await Member.findById(requesterId);
        if (!requester) return res.status(401).json({ message: "User not found." });

        // Check for duplicate active transaction
        const existing = await Transaction.findOne({
            bookId,
            memberId,
            status: { $in: ['PendingIssue', 'ApprovedIssue', 'ReturnPending'] }
        });

        if (existing) {
            return res.status(400).json({ message: "You already have an active request or an issued copy of this book." });
        }


        if (requester.role !== 'Admin' && memberId !== requesterId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const iDate = new Date(issueDate);
        const rDate = new Date(expectedReturnDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (iDate < today) return res.status(400).json({ message: "Invalid Issue Date" });
        if (rDate <= iDate) return res.status(400).json({ message: "Invalid Return Date" });

        const maxAllowed = new Date(iDate);
        maxAllowed.setDate(iDate.getDate() + 15);
        if (rDate > maxAllowed) return res.status(400).json({ message: "Return Window Exceeded" });

        const newTransaction = new Transaction({
            bookId, memberId, issueDate: iDate, expectedReturnDate: rDate, remarks, status: 'PendingIssue'
        });

        await newTransaction.save();
        res.status(201).json({ message: "SUCCESS", transaction: newTransaction });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.approveIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id);
        if (!transaction) return res.status(404).json({ message: "Not Found" });

        const book = await Book.findById(transaction.bookId);
        if (!book) return res.status(404).json({ message: "Book Not Found" });

        // Count active issues (ApprovedIssue or ReturnPending)
        const activeCount = await Transaction.countDocuments({
            bookId: transaction.bookId,
            status: { $in: ['ApprovedIssue', 'ReturnPending'] }
        });

        if (activeCount >= book.quantity) {
            return res.status(400).json({ message: "All copies are already issued." });
        }

        transaction.status = 'ApprovedIssue';
        transaction.approvalDate = new Date();
        await transaction.save();

        // If the last copy is being issued, mark book as 'Issued'
        if (activeCount + 1 === book.quantity) {
            await Book.findByIdAndUpdate(transaction.bookId, { status: 'Issued' });
        }

        res.status(200).json({ message: "SUCCESS" });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.rejectIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id);
        if (!transaction) return res.status(404).json({ message: "Not Found" });

        transaction.status = 'RejectedIssue';
        await transaction.save();
        res.status(200).json({ message: "SUCCESS" });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.requestReturn = async (req, res) => {
    try {
        const { transactionId, finePaid, remarks } = req.body;
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: "Not Found" });

        const actualReturnDate = new Date();
        const expectedReturnDate = new Date(transaction.expectedReturnDate);

        let calculatedFine = 0;
        if (actualReturnDate > expectedReturnDate) {
            const diffTime = Math.abs(actualReturnDate - expectedReturnDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            calculatedFine = diffDays * 10;
        }

        if (calculatedFine > 0 && !finePaid) {
            return res.status(400).json({ message: "Fine Required", fineAmount: calculatedFine });
        }

        transaction.status = 'ReturnPending';
        transaction.actualReturnDate = actualReturnDate;
        transaction.fineAmount = calculatedFine;
        transaction.finePaid = finePaid || false;
        transaction.remarks = remarks;
        await transaction.save();

        res.status(200).json({ message: "SUCCESS", fineCharged: calculatedFine });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.approveReturn = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id);
        if (!transaction) return res.status(404).json({ message: "Not Found" });

        transaction.status = 'Completed';
        await transaction.save();

        // When a return is approved, it is now available again since at least one copy is free
        await Book.findByIdAndUpdate(transaction.bookId, { status: 'Available' });

        res.status(200).json({ message: "SUCCESS" });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findById(id).populate('bookId memberId');
        if (!transaction) return res.status(404).json({ message: "Not Found" });
        res.status(200).json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
