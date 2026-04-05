import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

const BookIssue = () => {
    const { user } = useContext(AuthContext);
    const { showModal } = useModal();

    const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);
    const [searchFilter, setSearchFilter] = useState('');

    const todayStr = new Date().toISOString().split('T')[0];
    const initialMaxDate = new Date();
    initialMaxDate.setDate(initialMaxDate.getDate() + 15);

    const [form, setForm] = useState({
        bookId: '',
        memberId: user?.role !== 'Admin' ? user?.id : '',
        issueDate: todayStr,
        expectedReturnDate: initialMaxDate.toISOString().split('T')[0],
        remarks: ''
    });

    const [maxReturnDateStr, setMaxReturnDateStr] = useState(initialMaxDate.toISOString().split('T')[0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/reports');
                setBooks([...res.data.masterBooks, ...res.data.masterMovies].filter(b => b.status === 'Available'));
                setMembers(res.data.masterMembers);
            } catch (e) {}
        };
        fetchData();
    }, []);

    const handleIssueDateChange = (e) => {
        const newIssueDate = e.target.value;
        const dateObj = new Date(newIssueDate);
        dateObj.setDate(dateObj.getDate() + 15);
        const newMaxStr = dateObj.toISOString().split('T')[0];
        setMaxReturnDateStr(newMaxStr);
        setForm({ ...form, issueDate: newIssueDate, expectedReturnDate: newMaxStr });
    };

    const handleIssueRequest = async (e) => {
        e.preventDefault();
        try {
            if (!form.bookId) {
                return showModal({ title: 'Selection Required', message: 'Select an item from the matrix.', type: 'warning', showCancel: false });
            }
            if (user?.role === 'Admin' && (!form.memberId)) {
                return showModal({ title: 'Member Required', message: 'Select a member for issuance.', type: 'warning', showCancel: false });
            }
            await axios.post('/api/request-issue', form);
            await showModal({ title: 'Submitted', message: 'Issue request queued for approval.', type: 'success', showCancel: false });
            setForm({ ...form, bookId: '', remarks: '' });
            setSearchFilter('');
        } catch (err) {
            showModal({ title: 'Failed', message: err.response?.data?.message || 'Submission error.', type: 'error', showCancel: false });
        }
    };

    const author = books.find(b => b._id === form.bookId)?.author || '';
    const filteredBooks = books.filter(b => b.name.toLowerCase().includes(searchFilter.toLowerCase()) || b.serialNo.toLowerCase().includes(searchFilter.toLowerCase()));

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Issue Item Search Matrix</h1>
            <form onSubmit={handleIssueRequest} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold' }}>Available Items Matrix *</label>
                    <input type="text" className="input-field" placeholder="Search Title or Serial No..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} style={{ marginBottom: '1.25rem' }} />
                    <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                        <table style={{ margin: 0, width: '100%' }}>
                            <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--bg-card)' }}>
                                <tr>
                                    <th>Title</th>
                                    <th>Author / Director</th>
                                    <th>Serial No.</th>
                                    <th style={{ textAlign: 'center' }}>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBooks.map(b => (
                                    <tr key={b._id} style={{ backgroundColor: form.bookId === b._id ? 'rgba(6, 182, 212, 0.2)' : 'transparent' }}>
                                        <td>{b.name}</td>
                                        <td>{b.author}</td>
                                        <td>{b.serialNo}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input type="radio" name="bookSelection" checked={form.bookId === b._id} onChange={() => setForm({ ...form, bookId: b._id })} style={{ accentColor: 'var(--accent)', transform: 'scale(1.25)' }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div><label>Author / Director</label><input type="text" className="input-field" value={author} readOnly disabled style={{ opacity: 0.7 }} /></div>
                <div style={{ gridColumn: 'span 2' }}>
                    <label>Member ID / Recipient *</label>
                    {user?.role === 'Admin' ? (
                        <select className="input-field" value={form.memberId} onChange={e => setForm({ ...form, memberId: e.target.value })} required>
                            <option value="">-- Select Active Member --</option>
                            {members.map(m => <option key={m._id} value={m._id}>{m.firstName} {m.lastName} ({m.aadharNo})</option>)}
                        </select>
                    ) : ( <input type="text" className="input-field" value={user?.name || 'Member'} readOnly disabled style={{ color: 'var(--text-muted)' }} /> )}
                </div>
                <div><label>Issue Date *</label><input type="date" className="input-field" value={form.issueDate} min={todayStr} onChange={handleIssueDateChange} required /></div>
                <div><label>Return Date *</label><input type="date" className="input-field" value={form.expectedReturnDate} min={form.issueDate} max={maxReturnDateStr} onChange={e => setForm({ ...form, expectedReturnDate: e.target.value })} required /></div>
                <div style={{ gridColumn: 'span 2' }}><label>Remarks</label><input type="text" className="input-field" value={form.remarks} onChange={e => setForm({ ...form, remarks: e.target.value })} /></div>
                <button type="submit" className="btn-cyan" style={{ gridColumn: 'span 2', marginTop: '1rem' }}>Submit Issue Request</button>
            </form>
        </div>
    );
};

export default BookIssue;
