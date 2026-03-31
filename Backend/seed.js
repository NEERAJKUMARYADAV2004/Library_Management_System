require('dotenv').config();
const mongoose = require('mongoose');
const Member = require('./models/Member');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Member.deleteMany({ aadharNo: { $in: ['adm', 'user'] } });

    await Member.findOneAndUpdate(
        { role: 'Admin' }, 
        {
            firstName: 'System',
            lastName: 'Admin',
            aadharNo: '123123123123',
            password: 'adm',
            contactNo: '9876543210',
            membershipType: '1 year',
            status: 'Active'
        },
        { upsert: true, new: true }
    );

    await Member.findOneAndUpdate(
        { role: 'Member', firstName: 'Standard' }, 
        {
            firstName: 'Standard',
            lastName: 'Member',
            aadharNo: '123456789012',
            password: 'user',
            contactNo: '9988776655',
            membershipType: '6 months',
            status: 'Active'
        },
        { upsert: true, new: true }
    );

    mongoose.connection.close();
  })
  .catch(err => {
    process.exit(1);
  });
