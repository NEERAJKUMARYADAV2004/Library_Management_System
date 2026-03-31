import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpen, Users, IndianRupee, Clock } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, color }) => (
  <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
    <div style={{ backgroundColor: `${color}15`, padding: '1rem', borderRadius: '12px', color: color }}>
      <Icon size={28} />
    </div>
    <div>
      <h3 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: 600 }}>{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    books: 0,
    members: 0,
    activeIssues: 0,
    totalFines: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/reports');
        const { masterBooks, masterMovies, masterMembers, activeIssues } = res.data;
        
        let fines = 0; // Requires deep population to correctly aggregate actual fines, we mock placeholder bounds here.

        setMetrics({
          books: masterBooks.length + masterMovies.length,
          members: masterMembers.length,
          activeIssues: activeIssues.length,
          totalFines: 0
        });
        
        // Take latest 5 active issues as recent activity
        setRecentActivity(activeIssues.slice(-5).reverse());
      } catch(e) {
        console.error("Failed to load dashboard metrics");
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <MetricCard title="Total Inventory" value={metrics.books} icon={BookOpen} color="#06b6d4" />
        <MetricCard title="Registered Members" value={metrics.members} icon={Users} color="#10b981" />
        <MetricCard title="Active Issues" value={metrics.activeIssues} icon={Clock} color="#f59e0b" />
        <MetricCard title="Pending Fines" value={`₹${metrics.totalFines}`} icon={IndianRupee} color="#ef4444" />
      </div>

      <div className="glass-panel">
        <h2 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>Recent Active Issues</h2>
        {recentActivity.length === 0 ? (
           <p style={{ color: 'var(--text-muted)' }}>No recent activity found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Book/Movie ID</th>
                <th>Issue Date</th>
                <th>Expected Return</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map(act => (
                <tr key={act._id}>
                  <td>{act.memberId?.firstName} {act.memberId?.lastName}</td>
                  <td>{act.bookId?.name} ({act.bookId?.serialNo})</td>
                  <td>{new Date(act.issueDate).toLocaleDateString()}</td>
                  <td style={{ color: new Date(act.expectedReturnDate) < new Date() ? '#ef4444' : 'var(--text-main)' }}>
                    {new Date(act.expectedReturnDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
