import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Settings, Book, Reply, FileText, LogOut, Library } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

const Sidebar = () => {
  const { user, logoutContext } = useContext(AuthContext);
  const { showModal } = useModal();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    const confirmed = await showModal({
        title: 'Sign Out',
        message: 'Are you sure you want to log out?',
        type: 'warning',
        confirmLabel: 'Log Out',
        cancelLabel: 'Stay'
    });

    if (confirmed) {
        logoutContext();
        navigate('/logout-success');
    }
  };

  return (
    <div style={{ width: '260px', height: '100vh', backgroundColor: 'var(--bg-card)', borderRight: '1px solid var(--border-muted)', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          <Library color="var(--accent)" size={28}/>
          <div>
            <h2 style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 600 }}>LMS <span style={{ color: 'var(--accent)' }}>Pro</span></h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '-2px' }}>Role: {user.role === 'Member' ? 'Member' : 'Admin'}</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to={user.role === 'Admin' ? '/admin-dashboard' : '/user-dashboard'} style={{ textDecoration: 'none' }}>
             {({ isActive }) => (
               <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: isActive ? '#fff' : 'var(--text-muted)', backgroundColor: isActive ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s', boxShadow: isActive ? '0 4px 6px -1px rgba(6, 182, 212, 0.4)' : 'none' }}>
                 <Home size={20} />
                 <span>Dashboard</span>
               </div>
             )}
          </NavLink>

          {user.role === 'Admin' && (
            <NavLink to="/maintenance" style={{ textDecoration: 'none' }}>
               {({ isActive }) => (
                 <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: isActive ? '#fff' : 'var(--text-muted)', backgroundColor: isActive ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s', boxShadow: isActive ? '0 4px 6px -1px rgba(6, 182, 212, 0.4)' : 'none' }}>
                   <Settings size={20} />
                   <span>Maintenance</span>
                 </div>
               )}
            </NavLink>
          )}

          <NavLink to="/issue" style={{ textDecoration: 'none' }}>
             {({ isActive }) => (
               <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: isActive ? '#fff' : 'var(--text-muted)', backgroundColor: isActive ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s', boxShadow: isActive ? '0 4px 6px -1px rgba(6, 182, 212, 0.4)' : 'none' }}>
                 <Book size={20} />
                 <span>Issue Items</span>
               </div>
             )}
          </NavLink>

          <NavLink to="/return" style={{ textDecoration: 'none' }}>
             {({ isActive }) => (
               <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: isActive ? '#fff' : 'var(--text-muted)', backgroundColor: isActive ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s', boxShadow: isActive ? '0 4px 6px -1px rgba(6, 182, 212, 0.4)' : 'none' }}>
                 <Reply size={20} />
                 <span>Process Return</span>
               </div>
             )}
          </NavLink>

          <NavLink to="/reports" style={{ textDecoration: 'none' }}>
             {({ isActive }) => (
               <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: isActive ? '#fff' : 'var(--text-muted)', backgroundColor: isActive ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s', boxShadow: isActive ? '0 4px 6px -1px rgba(6, 182, 212, 0.4)' : 'none' }}>
                 <FileText size={20} />
                 <span>Reports Data</span>
               </div>
             )}
          </NavLink>
        </nav>
      </div>

      <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border-muted)', marginTop: 'auto' }}>
        <button 
          onClick={handleLogout} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', width: '100%', padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 500, borderRadius: '8px', transition: 'all 0.2s' }}
          onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.backgroundColor = 'var(--border-muted)'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
