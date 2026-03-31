import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookReturn = () => {
    const navigate = useNavigate();
    const [activeIssues, setActiveIssues] = useState([]);
    const [selectedIssueId, setSelectedIssueId] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [msg, setMsg] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const res = await axios.get('/api/reports');
                setActiveIssues(res.data.activeIssues || []);
            } catch (e) {}
        };
        fetchIssues();
    }, []);

    const filteredIssues = activeIssues.filter(issue =>
        issue.bookId?.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        issue.bookId?.serialNo.toLowerCase().includes(searchFilter.toLowerCase()) ||
        issue.memberId?.firstName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        issue.memberId?.lastName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        issue.memberId?.aadharNo.toLowerCase().includes(searchFilter.toLowerCase())
    );

    const handleConfirmSelection = (e) => {
        e.preventDefault();
        if (!selectedIssueId) return setMsg({ text: 'Selection required.', type: 'error' });
        navigate(`/pay-fine/${selectedIssueId}`);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Return Item Search Matrix</h1>
            {msg.text && (
                <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', backgroundColor: msg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: msg.type === 'error' ? '#ef4444' : '#10b981' }}>{msg.text}</div>
            )}
            <form onSubmit={handleConfirmSelection} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '1rem', borderRadius: '8px' }}>
                    <input type="text" className="input-field" placeholder="Search by Title, Serial, Member Name or Aadhar..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} style={{ marginBottom: '1.5rem' }} />
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <table style={{ margin: 0, width: '100%' }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-main)' }}>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Borrowed By (Member)</th>
                                    <th>Issue Date</th>
                                    <th style={{ textAlign: 'center' }}>Select</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIssues.map(issue => (
                                    <tr key={issue._id} style={{ backgroundColor: selectedIssueId === issue._id ? 'rgba(6, 182, 212, 0.15)' : 'transparent' }}>
                                        <td>{issue.bookId?.name}<br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SN: {issue.bookId?.serialNo}</span></td>
                                        <td>{issue.memberId?.firstName} {issue.memberId?.lastName}<br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {issue.memberId?.aadharNo}</span></td>
                                        <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <input type="radio" name="issueSelection" checked={selectedIssueId === issue._id} onChange={() => setSelectedIssueId(issue._id)} style={{ accentColor: 'var(--accent)', transform: 'scale(1.3)' }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <button type="submit" className="btn-cyan" style={{ width: '100%' }}>Confirm Selection & Proceed</button>
            </form>
        </div>
    );
};

export default BookReturn;
