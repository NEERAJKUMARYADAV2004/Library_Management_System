const Member = require('../models/Member');

exports.login = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const member = await Member.findOne({ aadharNo: userId, password: password });

        if (!member) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        res.status(200).json({
            message: "SUCCESS",
            user: {
                id: member._id,
                name: `${member.firstName} ${member.lastName}`,
                role: member.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
