import React, { useState } from 'react';
import axios from 'axios';
import { useModal } from '../context/ModalContext';
import { sanitizeNumeric, isValidLength } from '../utils/validation';

const Maintenance = () => {
    const { showModal } = useModal();
    const [tab, setTab] = useState('book');
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [msg, setMsg] = useState({ text: '', type: '' });

    const initBook = { _id: '', name: '', author: '', type: 'Book', category: 'General', serialNo: '', status: 'Available', cost: 0, quantity: 1, procurementDate: '' };
    const initMember = { _id: '', firstName: '', lastName: '', contactNo: '', address: '', aadharNo: '', membershipType: '6 months', password: '' };

    const [bookForm, setBookForm] = useState(initBook);
    const [memberForm, setMemberForm] = useState(initMember);

    const [touched, setTouched] = useState({ contactNo: false, aadharNo: false });

    const switchTab = (newTab) => {
        setTab(newTab);
        setMsg({ text: '' });
        setSearchId('');
        setIsUpdateMode(false);
        setBookForm(initBook);
        setMemberForm(initMember);
        setTouched({ contactNo: false, aadharNo: false });
    }

    const handleFetch = async () => {
        if (!searchId) return setMsg({ text: 'Please enter a search ID', type: 'error' });
        try {
            if (tab === 'book') {
                const res = await axios.get(`/api/book/${searchId}`);
                setBookForm({
                    _id: res.data._id,
                    name: res.data.name,
                    author: res.data.author,
                    type: res.data.type,
                    category: res.data.category || 'General',
                    serialNo: res.data.serialNo,
                    status: res.data.status,
                    cost: res.data.cost || 0,
                    quantity: res.data.quantity,
                    procurementDate: res.data.procurementDate ? res.data.procurementDate.split('T')[0] : ''
                });
                setIsUpdateMode(true);
                setMsg({ text: 'Book loaded', type: 'success' });
            } else {
                const res = await axios.get(`/api/member/${searchId}`);
                setMemberForm({
                    _id: res.data._id,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    contactNo: res.data.contactNo || '',
                    address: res.data.address || '',
                    aadharNo: res.data.aadharNo,
                    membershipType: res.data.membershipType,
                    password: ''
                });
                setIsUpdateMode(true);
                setMsg({ text: 'Member loaded', type: 'success' });
            }
        } catch (e) {
            setMsg({ text: 'Not found', type: 'error' });
            setIsUpdateMode(false);
            tab === 'book' ? setBookForm(initBook) : setMemberForm(initMember);
        }
    };

    const handleBookSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isUpdateMode) {
                await axios.put(`/api/update-book/${bookForm._id}`, bookForm);
                await showModal({ title: 'Success', message: 'Book updated.', type: 'success', showCancel: false });
            } else {
                const { _id, ...postData } = bookForm;
                await axios.post('/api/add-book', postData);
                await showModal({ title: 'Success', message: 'Book registered.', type: 'success', showCancel: false });
            }
            switchTab('book');
        } catch (err) { setMsg({ text: err.response?.data?.message || 'Error occurred', type: 'error' }); }
    };

    const handleMemberSubmit = async (e) => {
        e.preventDefault();

        const isContactValid = isValidLength(memberForm.contactNo, 10);
        const isAadharValid = isValidLength(memberForm.aadharNo, 12);

        if (!isContactValid || !isAadharValid) {
            setTouched({ contactNo: true, aadharNo: true });
            return showModal({
                title: 'Validation Error',
                message: 'Contact No must be 10 digits and Aadhar No must be 12 digits.',
                type: 'error',
                showCancel: false
            });
        }

        try {
            if (isUpdateMode) {
                await axios.put(`/api/update-member/${memberForm._id}`, memberForm);
                await showModal({ title: 'Success', message: 'Member profile updated.', type: 'success', showCancel: false });
            } else {
                const { _id, ...postData } = memberForm;
                await axios.post('/api/add-member', postData);
                await showModal({ title: 'Success', message: 'Member enrolled.', type: 'success', showCancel: false });
            }
            switchTab('member');
        } catch (err) { setMsg({ text: err.response?.data?.message || 'Error occurred', type: 'error' }); }
    };

    const handleRemoveMember = async () => {
        const confirmed = await showModal({
            title: 'Remove Member',
            message: 'Are you sure?',
            type: 'warning',
            confirmLabel: 'Remove',
            cancelLabel: 'Keep'
        });

        if (!confirmed) return;
        try {
            await axios.delete(`/api/remove-member/${memberForm._id}`);
            await showModal({ title: 'Removed', message: 'Member removed.', type: 'success', showCancel: false });
            switchTab('member');
        } catch (err) { setMsg({ text: err.response?.data?.message || 'Error occurred', type: 'error' }); }
    };

    const handleRemoveBook = async () => {
        const confirmed = await showModal({
            title: 'Remove Book',
            message: 'Are you sure?',
            type: 'warning',
            confirmLabel: 'Remove',
            cancelLabel: 'Keep'
        });

        if (!confirmed) return;
        try {
            await axios.delete(`/api/remove-book/${bookForm._id}`);
            await showModal({ title: 'Removed', message: 'Book removed.', type: 'success', showCancel: false });
            switchTab('book');
        } catch (err) { setMsg({ text: err.response?.data?.message || 'Error occurred', type: 'error' }); }
    };

    const isContactInvalid = touched.contactNo && !isValidLength(memberForm.contactNo, 10);
    const isAadharInvalid = touched.aadharNo && !isValidLength(memberForm.aadharNo, 12);

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>System Maintenance</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => switchTab('book')} className="btn-cyan" style={{ opacity: tab === 'book' ? 1 : 0.3, transition: 'opacity 0.2s' }}>Manage Inventory</button>
                <button onClick={() => switchTab('member')} className="btn-cyan" style={{ opacity: tab === 'member' ? 1 : 0.3, transition: 'opacity 0.2s' }}>Manage Membership</button>
            </div>

            <div className="glass-panel" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <input
                    type="text"
                    className="input-field"
                    placeholder={tab === 'book' ? "Enter Serial No..." : "Enter Aadhar No..."}
                    value={searchId}
                    onChange={(e) => setSearchId(sanitizeNumeric(e.target.value, tab === 'book' ? 20 : 12))}
                    style={{ flex: 1, margin: 0 }}
                />
                <button type="button" onClick={handleFetch} className="btn-cyan" style={{ padding: '0.75rem 1.5rem' }}>Fetch</button>
            </div>

            {msg.text && (
                <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', backgroundColor: msg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: msg.type === 'error' ? '#ef4444' : '#10b981', border: `1px solid ${msg.type === 'error' ? '#ef444450' : '#10b98150'}` }}>
                    {msg.text}
                </div>
            )}

            {tab === 'book' && (
                <form onSubmit={handleBookSubmit} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ gridColumn: 'span 2' }}><h2 style={{ fontSize: '1.125rem' }}>{isUpdateMode ? 'Update Entry' : 'New Registration'}</h2></div>
                    <div><label>Name / Title *</label><input type="text" className="input-field" value={bookForm.name} onChange={e => setBookForm({ ...bookForm, name: e.target.value })} required /></div>
                    <div><label>Author / Director *</label><input type="text" className="input-field" value={bookForm.author} onChange={e => setBookForm({ ...bookForm, author: e.target.value })} required disabled={isUpdateMode} style={{ opacity: isUpdateMode ? 0.6 : 1 }} /></div>
                    <div>
                        <label>Content Type</label>
                        <select className="input-field" value={bookForm.type} onChange={e => setBookForm({ ...bookForm, type: e.target.value })}>
                            <option>Book</option>
                            <option>Movie</option>
                        </select>
                    </div>
                    <div><label>Category *</label><input type="text" className="input-field" value={bookForm.category} onChange={e => setBookForm({ ...bookForm, category: e.target.value })} required /></div>
                    <div><label>Serial Number *</label><input type="text" className="input-field" value={bookForm.serialNo} onChange={e => setBookForm({ ...bookForm, serialNo: sanitizeNumeric(e.target.value, 15) })} required disabled={isUpdateMode} style={{ opacity: isUpdateMode ? 0.6 : 1 }} /></div>
                    <div><label>Cost *</label><input type="number" min="0" className="input-field" value={bookForm.cost} onChange={e => setBookForm({ ...bookForm, cost: e.target.value })} required /></div>
                    <div><label>Quantity</label><input type="number" min="1" className="input-field" value={bookForm.quantity} onChange={e => setBookForm({ ...bookForm, quantity: e.target.value })} /></div>
                    <div><label>Procurement Date</label><input type="date" className="input-field" value={bookForm.procurementDate} onChange={e => setBookForm({ ...bookForm, procurementDate: e.target.value })} /></div>
                    <div style={{ gridColumn: 'span 2', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn-cyan" style={{ flex: 1 }}>{isUpdateMode ? 'Submit Changes' : 'Register Entry'}</button>
                        {isUpdateMode && (
                            <button type="button" onClick={handleRemoveBook} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid currentColor', borderRadius: '8px', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>Remove</button>
                        )}
                    </div>
                </form>
            )}

            {tab === 'member' && (
                <form onSubmit={handleMemberSubmit} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ gridColumn: 'span 2' }}><h2 style={{ fontSize: '1.125rem' }}>{isUpdateMode ? 'Update Profile' : 'Enroll Member'}</h2></div>
                    <div><label>First Name *</label><input type="text" className="input-field" value={memberForm.firstName} onChange={e => setMemberForm({ ...memberForm, firstName: e.target.value })} required /></div>
                    <div><label>Last Name *</label><input type="text" className="input-field" value={memberForm.lastName} onChange={e => setMemberForm({ ...memberForm, lastName: e.target.value })} required /></div>
                    <div style={{ gridColumn: 'span 2' }}><label>Address</label><input type="text" className="input-field" value={memberForm.address} onChange={e => setMemberForm({ ...memberForm, address: e.target.value })} /></div>
                    <div>
                        <label>Contact No (10-Digit) *</label>
                        <input
                            type="text"
                            className={`input-field ${isContactInvalid ? 'invalid' : ''}`}
                            value={memberForm.contactNo}
                            onChange={e => setMemberForm({ ...memberForm, contactNo: sanitizeNumeric(e.target.value, 10) })}
                            onBlur={() => setTouched({ ...touched, contactNo: true })}
                            required
                        />
                    </div>
                    <div>
                        <label>Aadhar Number (12-Digit) *</label>
                        <input
                            type="text"
                            className={`input-field ${isAadharInvalid ? 'invalid' : ''}`}
                            value={memberForm.aadharNo}
                            onChange={e => setMemberForm({ ...memberForm, aadharNo: sanitizeNumeric(e.target.value, 12) })}
                            onBlur={() => setTouched({ ...touched, aadharNo: true })}
                            required
                            disabled={isUpdateMode}
                            style={{ opacity: isUpdateMode ? 0.6 : 1 }}
                        />
                    </div>
                    <div><label>Password *</label><input type="password" className="input-field" value={memberForm.password} onChange={e => setMemberForm({ ...memberForm, password: e.target.value })} required={!isUpdateMode} placeholder={isUpdateMode ? "Keep blank to retain" : ""} /></div>
                    <div style={{ gridColumn: 'span 2', backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: '8px' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 'bold' }}>Membership Duration *</label>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            {['6 months', '1 year', '2 years'].map(duration => (
                                <label key={duration} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="membershipType"
                                        value={duration}
                                        checked={memberForm.membershipType === duration}
                                        onChange={e => setMemberForm({ ...memberForm, membershipType: e.target.value })}
                                        style={{ accentColor: 'var(--accent)', width: '1.25rem', height: '1.25rem' }}
                                    />
                                    <span>{duration}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div style={{ gridColumn: 'span 2', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn-cyan" style={{ flex: 1 }}>{isUpdateMode ? 'Submit Updates' : 'Enroll Member'}</button>
                        {isUpdateMode && (
                            <button type="button" onClick={handleRemoveMember} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid currentColor', borderRadius: '8px', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}>Remove</button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
};

export default Maintenance;
