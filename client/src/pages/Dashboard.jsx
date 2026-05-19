import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Building2, FileText, CreditCard, Clock, Activity, ArrowUpRight, User, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, colorClass, linkTo, linkText }) => (
  <div className="card p-6 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow">
    <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 ${colorClass}`}></div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <div className={`p-2 rounded-lg ${colorClass} bg-opacity-20`}>
        <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div className="text-3xl font-bold text-gray-800 mb-4 relative z-10">{value}</div>
    {linkTo && (
      <Link to={linkTo} className="text-sm text-accent hover:text-emerald-700 font-medium flex items-center relative z-10">
        {linkText} <ArrowUpRight className="w-4 h-4 ml-1" />
      </Link>
    )}
  </div>
);

const Dashboard = () => {
  const { token } = useAuth();
  const { error } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/startups/stats', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      } else {
        error('Failed to load dashboard statistics.');
      }
    } catch (err) {
      error('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-gray-200 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-gray-200 rounded"></div><div className="h-4 bg-gray-200 rounded w-5/6"></div></div></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of incubation operations for {stats.currentMonth}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Startups" 
          value={stats.totalActive} 
          icon={Building2} 
          colorClass="bg-blue-500" 
          linkTo="/admin/startups" 
          linkText="View Roster" 
        />
        <StatCard 
          title="Pending Applications" 
          value={stats.pendingApplications} 
          icon={Clock} 
          colorClass="bg-yellow-500" 
          linkTo="/admin/startups?status=Pending Review" 
          linkText="Review Now" 
        />
        <StatCard 
          title="Seats Occupied" 
          value={`${stats.occupiedSeats} / ${stats.totalSeats}`} 
          icon={FileText} 
          colorClass="bg-purple-500" 
          linkTo="/admin/resources" 
          linkText="Manage Seating" 
        />
        <StatCard 
          title="Payments Due" 
          value={`₹${stats.paymentsDue.toLocaleString()}`} 
          icon={CreditCard} 
          colorClass="bg-red-500" 
          linkTo="/admin/payments" 
          linkText="View Invoices" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Activity className="w-5 h-5 mr-2 text-primary" /> Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/startups" className="p-4 border rounded-xl hover:border-primary hover:bg-blue-50 transition-colors flex flex-col items-center justify-center text-center group">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-3 group-hover:scale-110 transition-transform"><Building2 className="w-6 h-6" /></div>
              <span className="font-medium text-gray-800">Add Startup</span>
            </Link>
            <Link to="/admin/resources" className="p-4 border rounded-xl hover:border-primary hover:bg-purple-50 transition-colors flex flex-col items-center justify-center text-center group">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mb-3 group-hover:scale-110 transition-transform"><FileText className="w-6 h-6" /></div>
              <span className="font-medium text-gray-800">Book Board Room</span>
            </Link>
            <Link to="/admin/people" className="p-4 border rounded-xl hover:border-primary hover:bg-green-50 transition-colors flex flex-col items-center justify-center text-center group">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mb-3 group-hover:scale-110 transition-transform"><User className="w-6 h-6" /></div>
              <span className="font-medium text-gray-800">Register Member</span>
            </Link>
            <Link to="/admin/payments" className="p-4 border rounded-xl hover:border-primary hover:bg-orange-50 transition-colors flex flex-col items-center justify-center text-center group">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mb-3 group-hover:scale-110 transition-transform"><CreditCard className="w-6 h-6" /></div>
              <span className="font-medium text-gray-800">Log Payment</span>
            </Link>
          </div>
        </div>
        
        <div className="card p-6 bg-primary text-white">
          <h3 className="text-lg font-bold mb-4">System Alerts</h3>
          <div className="space-y-4">
            {stats.pendingApplications > 0 && (
              <div className="p-4 bg-white/10 rounded-lg border border-white/20 flex items-start">
                <Clock className="w-5 h-5 mr-3 mt-0.5 text-yellow-300" />
                <div>
                  <p className="font-medium">New Applications Waiting</p>
                  <p className="text-sm text-blue-100 mt-1">There are {stats.pendingApplications} startup applications awaiting administrative review.</p>
                </div>
              </div>
            )}
            {stats.paymentsDue > 0 && (
              <div className="p-4 bg-white/10 rounded-lg border border-white/20 flex items-start">
                <CreditCard className="w-5 h-5 mr-3 mt-0.5 text-red-300" />
                <div>
                  <p className="font-medium">Outstanding Dues</p>
                  <p className="text-sm text-blue-100 mt-1">₹{stats.paymentsDue.toLocaleString()} in dues are pending collection for {stats.currentMonth}.</p>
                </div>
              </div>
            )}
            {stats.pendingApplications === 0 && stats.paymentsDue === 0 && (
              <div className="p-8 text-center text-blue-200">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>All clear! No pending alerts for today.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
