const Book = require('../models/Book');
const Member = require('../models/Member');
const Transaction = require('../models/Transaction');

exports.getReports = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        if (!userId) return res.status(401).json({ message: "Authentication context required." });

        const requestingUser = await Member.findById(userId);
        if (!requestingUser) return res.status(401).json({ message: "User identity invalid." });

        const masterBooks = await Book.find({ type: 'Book' });
        const masterMovies = await Book.find({ type: 'Movie' });
        const masterMembers = await Member.find({});
        
        // Unify Statuses for Queries
        let activeQuery = { status: 'ApprovedIssue', actualReturnDate: { $exists: false } };
        let pendingQuery = { status: 'PendingIssue' };
        let returnQuery = { status: 'ReturnPending' };

        if (requestingUser.role !== 'Admin') {
            activeQuery.memberId = userId;
            pendingQuery.memberId = userId;
            returnQuery.memberId = userId;
        }

        const activeIssues = await Transaction.find(activeQuery).populate('bookId memberId');
        const pendingRequests = await Transaction.find(pendingQuery).populate('bookId memberId');
        const returnRequests = await Transaction.find(returnQuery).populate('bookId memberId');

        const today = new Date();
        const overdueReturns = activeIssues.filter(t => new Date(t.expectedReturnDate) < today);

        res.status(200).json({
            masterBooks,
            masterMovies,
            masterMembers,
            activeIssues,
            pendingRequests,
            returnRequests,
            overdueReturns
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
