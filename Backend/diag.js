const mongoose = require('mongoose');
require('dotenv').config();
const Member = require('./models/Member');

async function check() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    const members = await Member.find({});
    console.log('MEMBER_COUNT:', members.length);
    members.forEach(m => {
        console.log(`- ID: ${m._id}, Aadhar: ${m.aadharNo}, Pass: ${m.password}, Role: ${m.role}`);
    });
  } catch (err) {
    console.error('ERROR:', err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}
check();
