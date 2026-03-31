import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';

const PayFine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fine, setFine] = useState(0);
    const [finePaid, setFinePaid] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [msg, setMsg] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const res = await axios.get(`/api/transaction/${id}`);
                setTransaction(res.data);
                
                // Calculate Fine (Source 15 Logic: 10 units per day overdue)
                const expected = new Date(res.data.expectedReturnDate);
                const actual = new Date();
                let calculated = 0;
                if (actual > expected) {
                    const diffTime = Math.abs(actual - expected);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    calculated = diffDays * 10;
                }
                setFine(calculated);
                setLoading(false);
            } catch (e) {
                console.error("Failed to load transaction", e);
                showModal({
                    title: 'Fetch Error',
                    message: 'Transaction not found or server is unreachable.',
                    type: 'error',
                    showCancel: false
                });
                setLoading(false);
            }
        };
        fetchTransaction();
    }, [id, showModal]);

    const handleCompleteReturn = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/request-return', {
                transactionId: id,
                finePaid: finePaid,
                remarks: remarks
            });
            
            await showModal({
                title: 'Return Request Submitted',
                message: 'Your return has been processed. Awaiting final Admin verification of fine payment and item condition.',
                type: 'success',
                showCancel: false
            });
            
            navigate('/reports');
        } catch (err) {
            showModal({
                title: 'Process Error',
                message: err.response?.data?.message || 'Error occurred during return processing.',
                type: 'error',
                showCancel: false
            });
        }
    };


    if (loading) return <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>Processing Payment Matrix...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Fine Settlement & Return Confirmation</h1>

            {msg.text && (
                <div style={{ padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', backgroundColor: msg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', color: msg.type === 'error' ? '#ef4444' : '#10b981', border: `1px solid ${msg.type === 'error' ? '#ef444450' : '#10b98150'}` }}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleCompleteReturn} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', border: '1px solid var(--border-muted)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Issued Item</span>
                            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{transaction?.bookId?.name}</p>
                            <p style={{ fontSize: '0.8rem' }}>SN: {transaction?.bookId?.serialNo}</p>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Borrowed By</span>
                            <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{transaction?.memberId?.firstName} {transaction?.memberId?.lastName}</p>
                            <p style={{ fontSize: '0.8rem' }}>ID: {transaction?.memberId?.aadharNo}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Issue Date</span>
                            <p>{new Date(transaction?.issueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Expected Return Date</span>
                            <p style={{ color: fine > 0 ? '#ef4444' : 'var(--text-main)', fontWeight: 600 }}>
                                {new Date(transaction?.expectedReturnDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem', backgroundColor: fine > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', border: `1px solid ${fine > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`, marginBottom: '1.5rem', textAlign: 'center' }}>
                        <span style={{ color: fine > 0 ? '#ef4444' : '#10b981', fontWeight: 'bold', fontSize: '1.5rem' }}>
                            Calculated Fine Amount: ₹{fine}
                        </span>
                        {fine > 0 && <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '0.5rem' }}>Item is Overdue. Please settle at counter.</p>}
                    </div>

                    {fine > 0 && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-main)', cursor: 'pointer', backgroundColor: 'rgba(6, 182, 212, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
                            <input
                                type="checkbox"
                                checked={finePaid}
                                onChange={e => setFinePaid(e.target.checked)}
                                style={{ width: '1.75rem', height: '1.75rem', accentColor: 'var(--accent)' }}
                            />
                            <div style={{ flex: 1 }}>
                                <span style={{ fontWeight: 'bold', display: 'block' }}>Payment Confirmation (Source 15 Guard)</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>I confirm that the fine amount of ₹{fine} has been paid and verified.</span>
                            </div>
                        </label>
                    )}

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Condition Remarks (Required for Return)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                            placeholder="E.g., Returned in good condition..."
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-cyan"
                        disabled={fine > 0 && !finePaid}
                        style={{ width: '100%', padding: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}
                    >
                        Complete Return Process
                    </button>
                    {fine > 0 && !finePaid && (
                        <p style={{ fontSize: '0.75rem', textAlign: 'center', color: '#ef4444', marginTop: '0.75rem' }}>
                            Button disabled: Please confirm fine settlement before processing.
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default PayFine;
