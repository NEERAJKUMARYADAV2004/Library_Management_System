import React from 'react';
import { Link } from 'react-router-dom';

const LogoutSuccess = () => {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: '#111827', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* Header Navigation */}
      <header style={{ 
        padding: '1.5rem 3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <Link to="/charts" style={{ 
          color: 'var(--accent)', 
          textDecoration: 'none', 
          fontWeight: '600',
          fontSize: '0.9rem'
        }}>
          📊 Chart
        </Link>
        <Link to="/login" style={{ 
          color: 'var(--text-main)', 
          textDecoration: 'none', 
          fontWeight: '600',
          fontSize: '0.9rem'
        }}>
          Sign In →
        </Link>
      </header>

      {/* Centered Message Card */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '2rem'
      }}>
        <div className="glass-panel" style={{ 
          maxWidth: '500px', 
          width: '100%', 
          textAlign: 'center', 
          padding: '4rem 2rem',
          backdropFilter: 'blur(12px)'
        }}>
          <div style={{ 
            fontSize: '3.5rem', 
            marginBottom: '1.5rem',
            opacity: 0.9 
          }}>
            👋
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: '700', 
            color: '#fff', 
            marginBottom: '1rem',
            letterSpacing: '-0.025em'
          }}>
            You have successfully logged out.
          </h1>
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>
            Thank you for using the Library Management System. <br/>
            Your session has been securely terminated.
          </p>
          
          <div style={{ marginTop: '2.5rem' }}>
            <Link to="/login" className="btn-cyan" style={{ 
              textDecoration: 'none', 
              display: 'inline-block',
              padding: '0.75rem 2.5rem'
            }}>
              Return to Login
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Branding */}
      <footer style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        color: 'rgba(255, 255, 255, 0.2)',
        fontSize: '0.75rem'
      }}>
        © 2026 Library Management System Pro • Protocol Secure
      </footer>
    </div>
  );
};

export default LogoutSuccess;
