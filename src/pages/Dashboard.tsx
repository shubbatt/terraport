import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileUp, ListChecks, Bell, Search, Map } from 'lucide-react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div style={{ marginBottom: '30px', padding: '0 10px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Menu</h3>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Overview
          </Link>
          <Link to="/upload" className={`sidebar-link ${location.pathname === '/upload' ? 'active' : ''}`}>
            <FileUp size={20} /> Upload Documents
          </Link>
          <a href="#" className="sidebar-link">
            <ListChecks size={20} /> Active Tasks
          </a>
          <a href="#" className="sidebar-link">
            <Map size={20} /> Tracking
          </a>
        </nav>

        <div style={{ marginTop: 'auto', padding: '20px 10px' }}>
          {user?.role === 'admin' ? (
             <div style={{ background: '#d4edda', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
               <h4 style={{ marginBottom: '10px', color: '#155724' }}>Admin Mode</h4>
               <p style={{ fontSize: '0.85rem', color: '#155724', marginBottom: '15px' }}>Back-office access enabled. You can manage status.</p>
             </div>
          ) : (
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
              <h4 style={{ marginBottom: '10px' }}>Need Help?</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '15px' }}>Contact our logistics support team for assistance.</p>
              <button className="btn btn-outline-dark" style={{ width: '100%', padding: '10px' }} onClick={() => alert('Support triggered!')}>Support</button>
            </div>
          )}
          <button className="btn btn-outline" style={{width: '100%', marginTop: '10px', color: 'var(--danger)', borderColor: 'var(--danger)'}} onClick={logout}>Sign Out</button>
        </div>
      </aside>
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
};

const Dashboard = () => {
  const { user, token } = useAuth();
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/jobs', {
        headers: { Authorization: "Bearer " + token }
      });
      if (res.ok) {
        const data = await res.json();
        setActiveJobs(data.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch("http://localhost:3001/api/jobs/" + id + "/status", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchJobs(); // refresh
      } else {
        const err = await res.json();
        alert(err.message);
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Processing': return 'status-processing';
      case 'Cleared': return 'status-cleared';
      case 'Delivered': return 'status-delivered';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}</h1>
          <p>Here is an overview of {user?.role === 'admin' ? 'all customer' : 'your active'} logistics requests and shipments.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
            <input type="text" placeholder="Search reference..." style={{ padding: '10px 15px 10px 40px', borderRadius: '8px', border: '1px solid #e1e8ed' }} />
          </div>
          <button className="btn-icon" style={{ background: 'white', border: '1px solid #e1e8ed' }}>
            <Bell size={20} color="var(--text)" />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Active Clearance</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--dark)' }}>
            {activeJobs.filter(j => j.status === 'Pending' || j.status === 'Processing').length}
          </div>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Tracking Operations</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--dark)' }}>
            {activeJobs.length}
          </div>
        </div>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Completed</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--dark)' }}>
             {activeJobs.filter(j => j.status === 'Cleared' || j.status === 'Delivered').length}
          </div>
        </div>
      </div>

      <h3 style={{ marginBottom: '20px' }}>{user?.role === 'admin' ? 'Global Work Queue' : 'Recent Shipments & Tasks'}</h3>
      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>Loading records...</div>
        ) : activeJobs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>No records found. Create one by uploading a document.</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                {user?.role === 'admin' && <th>Customer</th>}
                <th>Document</th>
                <th>Service Type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeJobs.map((job) => (
                <tr key={job.id}>
                  <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{job.reference}</td>
                  {user?.role === 'admin' && <td>{job.customer_name}</td>}
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{job.original_name}</span>
                  </td>
                  <td>{job.service_type}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
                    {new Date(job.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    {user?.role === 'admin' ? (
                      <select 
                        value={job.status} 
                        onChange={(e) => updateStatus(job.id, e.target.value)}
                        style={{ padding: '5px', borderRadius: '6px', border: '1px solid #ccc', background: '#f8fafc', outline: 'none' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Cleared">Cleared</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      <span className={`status-badge ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
export { DashboardLayout };
