import React from 'react';
import { useModal } from '../context/ModalContext';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

const ConfirmModal = () => {
    const { modalConfig, handleConfirm, handleCancel } = useModal();

    if (!modalConfig.isOpen) return null;

    const getIcon = () => {
        switch (modalConfig.type) {
            case 'success': return <CheckCircle size={32} color="#10b981" />;
            case 'warning': return <AlertTriangle size={32} color="#f59e0b" />;
            case 'info':
            default: return <Info size={32} color="#06b6d4" />;
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease-out'
        }}>
            <div className="glass-panel" style={{
                width: '450px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                backgroundColor: '#111827',
                position: 'relative'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {getIcon()}
                    </div>
                    <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-main)' }}>{modalConfig.title}</h3>
                </div>

                <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                    {modalConfig.message}
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    {modalConfig.showCancel && (
                        <button
                            onClick={handleCancel}
                            style={{
                                flex: 1,
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'transparent',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                color: 'var(--accent)',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(6, 182, 212, 0.05)'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                            {modalConfig.cancelLabel}
                        </button>
                    )}
                    <button
                        onClick={handleConfirm}
                        className="btn-cyan"
                        style={{
                            flex: 1,
                            padding: '0.75rem 1.5rem',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        {modalConfig.confirmLabel}
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ConfirmModal;
