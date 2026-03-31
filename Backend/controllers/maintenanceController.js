const Book = require('../models/Book');
const Member = require('../models/Member');

exports.addBook = async (req, res) => {
  try {
    const { name, author, type, serialNo, status, quantity, procurementDate } = req.body;

    if (!name || !author || !serialNo) {
      return res.status(400).json({ message: 'Name, author and serialNo are mandatory' });
    }

    const book = new Book({ name, author, type, serialNo, status, quantity, procurementDate });
    await book.save();
    
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Serial number must be unique' });
    res.status(500).json({ message: err.message });
  }
};

exports.getBook = async (req, res) => {
  try {
    const { searchId } = req.params;
    let book = await Book.findOne({ serialNo: searchId });
    if (!book) {
        book = await Book.findById(searchId).catch(()=>null);
    }
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch(err) { res.status(500).json({ message: err.message }); }
}

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updated = await Book.findByIdAndUpdate(id, body, { new: true });
    if (!updated) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book updated successfully", updated });
  } catch(err) { res.status(500).json({ message: err.message }); }
}

exports.removeBook = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: "Book entry removed successfully" });
  } catch(err) { res.status(500).json({ message: err.message }); }
}

exports.addMember = async (req, res) => {
  try {
    const { firstName, lastName, contactNo, address, aadharNo, membershipType, status, role, password } = req.body;

    if (!firstName || !lastName || !aadharNo || !password) {
      return res.status(400).json({ message: 'firstName, lastName, aadharNo, and password are mandatory' });
    }

    const start = new Date();
    const end = new Date(start);
    if (membershipType === '6 months') end.setMonth(end.getMonth() + 6);
    else if (membershipType === '1 year') end.setFullYear(end.getFullYear() + 1);
    else if (membershipType === '2 years') end.setFullYear(end.getFullYear() + 2);

    const member = new Member({ 
       firstName, lastName, contactNo, address, aadharNo, membershipType, 
       status, role, password, startDate: start, endDate: end 
    });
    
    await member.save();
    
    res.status(201).json({ message: 'Member added successfully', member });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Aadhar No must be unique' });
    res.status(500).json({ message: err.message });
  }
};

exports.getMember = async (req, res) => {
  try {
    const { searchId } = req.params;
    let member = await Member.findOne({ aadharNo: searchId });
    if (!member) {
        member = await Member.findById(searchId).catch(()=>null);
    }
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.status(200).json(member);
  } catch(err) { res.status(500).json({ message: err.message }); }
}

exports.updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.membershipType) {
        const start = new Date();
        const end = new Date(start);
        if (updateData.membershipType === '6 months') end.setMonth(end.getMonth() + 6);
        else if (updateData.membershipType === '1 year') end.setFullYear(end.getFullYear() + 1);
        else if (updateData.membershipType === '2 years') end.setFullYear(end.getFullYear() + 2);
        updateData.endDate = end;
    }

    const updated = await Member.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Member not found" });
    res.status(200).json({ message: "Member updated successfully", updated });
  } catch(err) { res.status(500).json({ message: err.message }); }
}

exports.removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    await Member.findByIdAndDelete(id);
    res.status(200).json({ message: "Member deleted successfully" });
  } catch(err) { res.status(500).json({ message: err.message }); }
}
