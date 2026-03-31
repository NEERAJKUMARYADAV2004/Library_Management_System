const Member = require('../models/Member');

exports.isAdmin = async (req, res, next) => {
    try {
        const userId = req.headers['x-user-id'];
        
        if (!userId) {
            return res.status(401).json({ message: "Authentication required (x-user-id header missing)." });
        }

        const user = await Member.findById(userId);
        
        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        if (user.role !== 'Admin') {
            return res.status(403).json({ message: "Forbidden: Admin access required." });
        }

        req.user = user; 
        next();
    } catch (err) {
        res.status(500).json({ message: "Server error during authentication.", error: err.message });
    }
};
