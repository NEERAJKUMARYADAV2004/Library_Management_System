import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useModal } from '../context/ModalContext';
import { AuthContext } from '../context/AuthContext';

const StatusBadge = ({ status }) => {
    let bgColor = 'rgba(255, 255, 255, 0.05)';
    let textColor = '#fff';

    // Map internal status strings to user-friendly labels
    const displayNames = {
        'ApprovedIssue': 'Approved',
        'PendingIssue': 'Pending',
        'RejectedIssue': 'Rejected',
        'ReturnPending': 'Return Pending',
        'Completed': 'Completed',
        'Issued': 'Issued',
        'Available': 'Available',
        'Active': 'Active',
        'Inactive': 'Inactive'
    };

    switch (status) {
        case 'ApprovedIssue':
        case 'Active':
        case 'Available':
            bgColor = 'rgba(16, 185, 129, 0.1)';
            textColor = '#10b981';
            break;
        case 'Issued':
            bgColor = 'rgba(59, 130, 246, 0.1)';
            textColor = '#3b82f6';
            break;
        case 'PendingIssue':
        case 'ReturnPending':
            bgColor = 'rgba(245, 158, 11, 0.1)';
            textColor = '#f59e0b';
            break;
        case 'RejectedIssue':
        case 'Inactive':
        case 'Completed':
        case 'Closed':
            bgColor = 'rgba(239, 68, 68, 0.1)';
            textColor = '#ef4444';
            break;
        default:
            break;
    }

    return (
        <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            backgroundColor: bgColor,
            color: textColor,
            border: `1px solid ${textColor}30`,
            display: 'inline-block'
        }}>
            {displayNames[status] || status}
        </span>
    );
};

const Reports = () => {
    const { user } = useContext(AuthContext);
    const { showModal } = useModal();
    const [data, setData] = useState({ books: [], movies: [], overdue: [], members: [], pending: [], returns: [], active: [] });
    const [tab, setTab] = useState('members');
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/reports');
            setData({
                books: res.data.masterBooks,
                movies: res.data.masterMovies,
                overdue: res.data.overdueReturns,
                members: res.data.masterMembers,
                pending: res.data.pendingRequests || [],
                returns: res.data.returnRequests || [],
                active: res.data.activeIssues || []
            });
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const calculateFine = (expectedDate) => {
        const today = new Date();
        const expected = new Date(expectedDate);
        if (today <= expected) return '₹0';
        const diffDays = Math.ceil(Math.abs(today - expected) / (1000 * 60 * 60 * 24));
        return `₹${diffDays * 10}`;
    };

    const handleIssueAction = async (id, action) => {
        const isApprove = action === 'approve';
        const confirmed = await showModal({
            title: isApprove ? 'Approve Issue' : 'Reject Issue',
            message: `Are you sure you want to ${action} this issue request?`,
            type: isApprove ? 'info' : 'warning',
            confirmLabel: isApprove ? 'Confirm Approval' : 'Confirm Rejection'
        });
        if (!confirmed) return;
        try {
            await axios.put(`/api/${action}-issue/${id}`);
            await showModal({ title: 'Success', message: `Request ${isApprove ? 'approved' : 'rejected'} successfully.`, type: 'success', showCancel: false });
            fetchData();
        } catch (err) {
            showModal({
                title: 'Operation Failed',
                message: err.response?.data?.message || 'Error processing request',
                type: 'error',
                showCancel: false
            });
        }
    };

    const handleReturnApproval = async (id) => {
        const confirmed = await showModal({
            title: 'Verify Return',
            message: 'Have you verified the item condition and confirmed that any required fines were paid?',
            type: 'info',
            confirmLabel: 'Approve & Close Return',
            cancelLabel: 'Cancel'
        });
        if (!confirmed) return;
        try {
            await axios.put(`/api/approve-return/${id}`);
            await showModal({ title: 'Return Completed', message: 'Item is now available in inventory and records are closed.', type: 'success', showCancel: false });
            fetchData();
        } catch (err) {
            showModal({
                title: 'Verification Failed',
                message: err.response?.data?.message || 'Error processing return',
                type: 'error',
                showCancel: false
            });
        }
    };

    return (
        <div style={{ maxWidth: '1110px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Library Operations & Reports</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button onClick={() => setTab('members')} className="btn-cyan" style={{ opacity: tab === 'members' ? 1 : 0.4 }}>Members</button>
                <button onClick={() => setTab('books')} className="btn-cyan" style={{ opacity: tab === 'books' ? 1 : 0.4 }}>Books</button>
                <button onClick={() => setTab('movies')} className="btn-cyan" style={{ opacity: tab === 'movies' ? 1 : 0.4 }}>Movies</button>
                <button onClick={() => setTab('active')} className="btn-cyan" style={{ opacity: tab === 'active' ? 1 : 0.4 }}>Active Issues ({data.active.length})</button>
                <button onClick={() => setTab('pending')} className="btn-cyan" style={{ opacity: tab === 'pending' ? 1 : 0.4 }}>Issue Requests ({data.pending.length})</button>
                <button onClick={() => setTab('returns')} className="btn-cyan" style={{ opacity: tab === 'returns' ? 1 : 0.4, border: '1px solid var(--accent)' }}>Return Requests ({data.returns.length})</button>
                <button onClick={() => setTab('overdue')} className="btn-cyan" style={{ opacity: tab === 'overdue' ? 1 : 0.4, backgroundColor: tab === 'overdue' ? '#ef4444' : 'var(--accent)' }}>Overdue</button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto', minHeight: '350px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>Synchronizing Secure Records...</div>
                ) : (
                    <>
                        {tab === 'members' && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Membership Id</th>
                                        <th>Name of Member</th>
                                        <th>Contact Number</th>
                                        <th>Contact Address</th>
                                        <th>Aadhar Card No.</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Amount Pending</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.members.map(m => (
                                        <tr key={m._id}>
                                            <td style={{ fontWeight: 'bold' }}>{m._id.slice(-5).toUpperCase()}</td>
                                            <td>{m.firstName} {m.lastName}</td>
                                            <td>{m.contactNo}</td>
                                            <td>{m.address}</td>
                                            <td>{m.aadharNo}</td>
                                            <td>{new Date(m.startDate).toLocaleDateString()}</td>
                                            <td>{m.endDate ? new Date(m.endDate).toLocaleDateString() : 'Active'}</td>
                                            <td><StatusBadge status={m.status} /></td>
                                            <td style={{ color: m.amountPending > 0 ? '#ef4444' : 'inherit' }}>₹{m.amountPending || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {tab === 'books' && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Serial No</th>
                                        <th>Name of Book</th>
                                        <th>Author Name</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Cost</th>
                                        <th>Procurement Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.books.map(b => (
                                        <tr key={b._id}>
                                            <td>{b.serialNo}</td>
                                            <td>{b.name}</td>
                                            <td>{b.author}</td>
                                            <td>{b.category || 'General'}</td>
                                            <td><StatusBadge status={b.status} /></td>
                                            <td>₹{b.cost || 0}</td>
                                            <td>{new Date(b.procurementDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {tab === 'movies' && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Serial No</th>
                                        <th>Name of Movie</th>
                                        <th>Author Name</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Cost</th>
                                        <th>Procurement Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.movies.map(m => (
                                        <tr key={m._id}>
                                            <td>{m.serialNo}</td>
                                            <td>{m.name}</td>
                                            <td>{m.author}</td>
                                            <td>{m.category || 'Cinema'}</td>
                                            <td><StatusBadge status={m.status} /></td>
                                            <td>₹{m.cost || 0}</td>
                                            <td>{new Date(m.procurementDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {tab === 'active' && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Serial No Book/Movie</th>
                                        <th>Name of Book/Movie</th>
                                        <th>Aadhar Card No.</th>
                                        <th>Date of Issue</th>
                                        <th>Date of return</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.active.map(a => (
                                        <tr key={a._id}>
                                            <td>{a.bookId?.serialNo}</td>
                                            <td>{a.bookId?.name}</td>
                                            <td>{a.memberId?.aadharNo}</td>
                                            <td>{new Date(a.issueDate).toLocaleDateString()}</td>
                                            <td>{new Date(a.expectedReturnDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {tab === 'pending' && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Membership Id</th>
                                        <th>Name of Book/Movie</th>
                                        <th>Requested Date</th>
                                        <th>Request Fulfilled Date</th>
                                        {user?.role === 'Admin' && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.pending.map(p => (
                                        <tr key={p._id}>
                                            <td>{p.memberId?.aadharNo}</td>
                                            <td>{p.bookId?.name}</td>
                                            <td>{new Date(p.requestDate).toLocaleDateString()}</td>
                                            <td>{p.approvalDate ? new Date(p.approvalDate).toLocaleDateString() : 'Processing'}</td>
                                            {user?.role === 'Admin' && (
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button onClick={() => handleIssueAction(p._id, 'approve')} className="btn-cyan" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>Approve</button>
                                                        <button onClick={() => handleIssueAction(p._id, 'reject')} className="btn-cyan" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', backgroundColor: '#ef4444' }}>Reject</button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {tab === 'returns' && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Member</th>
                                        <th>Item</th>
                                        <th>Ret. Date</th>
                                        <th>Fine Paid</th>
                                        <th>Status</th>
                                        {user?.role === 'Admin' && <th>Action</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.returns.map(r => (
                                        <tr key={r._id}>
                                            <td>{r.memberId?.firstName}</td>
                                            <td>{r.bookId?.name}</td>
                                            <td>{new Date(r.actualReturnDate).toLocaleDateString()}</td>
                                            <td style={{ color: r.finePaid ? '#10b981' : '#ef4444' }}>{r.finePaid ? 'Yes' : 'No (₹' + (r.fineAmount || 0) + ')'}</td>
                                            <td><StatusBadge status={r.status} /></td>
                                            {user?.role === 'Admin' && <td><button onClick={() => handleReturnApproval(r._id)} className="btn-cyan" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>Approve Return</button></td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {tab === 'overdue' && (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Serial No Book</th>
                                        <th>Name of Book</th>
                                        <th>Membership Id</th>
                                        <th>Date of Issue</th>
                                        <th>Date of return</th>
                                        <th>Fine Calculations</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.overdue.map(o => (
                                        <tr key={o._id}>
                                            <td>{o.bookId?.serialNo}</td>
                                            <td>{o.bookId?.name}</td>
                                            <td>{o.memberId?.aadharNo}</td>
                                            <td>{new Date(o.issueDate).toLocaleDateString()}</td>
                                            <td>{new Date(o.expectedReturnDate).toLocaleDateString()}</td>
                                            <td style={{ color: '#ef4444', fontWeight: 'bold' }}>{calculateFine(o.expectedReturnDate)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Reports;
