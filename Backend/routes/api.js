const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const maint = require('../controllers/maintenanceController');
const trans = require('../controllers/transactionController');
const reports = require('../controllers/reportController');
const { isAdmin } = require('../middleware/authMiddleware');

// Auth
router.post('/login', auth.login);

// Maintenance (Admin Only strictly enforced by middleware)
router.post('/add-book', isAdmin, maint.addBook);
router.get('/book/:searchId', isAdmin, maint.getBook);
router.put('/update-book/:id', isAdmin, maint.updateBook);
router.delete('/remove-book/:id', isAdmin, maint.removeBook);

router.post('/add-member', isAdmin, maint.addMember);
router.get('/member/:searchId', isAdmin, maint.getMember);
router.put('/update-member/:id', isAdmin, maint.updateMember);
router.delete('/remove-member/:id', isAdmin, maint.removeMember);

// Transactions
router.post('/request-issue', trans.requestIssue);
router.post('/request-return', trans.requestReturn);
router.get('/transaction/:id', trans.getTransactionById);

// Admin Approval/Rejection
router.put('/approve-issue/:id', isAdmin, trans.approveIssue);
router.put('/reject-issue/:id', isAdmin, trans.rejectIssue);
router.put('/approve-return/:id', isAdmin, trans.approveReturn);



// Reports
router.get('/reports', reports.getReports);

module.exports = router;
