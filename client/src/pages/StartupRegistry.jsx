import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import { Search, Filter, MoreVertical, Building2, Calendar, FileText } from 'lucide-react';

const StartupRegistry = () => {
  const { token } = useAuth();
  const { error } = useToast();
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchStartups();
  }, [searchTerm, statusFilter]);

  const fetchStartups = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const url = new URL('/api/startups', baseUrl);
      if (searchTerm) url.searchParams.append('search', searchTerm);
      if (statusFilter) url.searchParams.append('status', statusFilter);
      
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setStartups(data.startups);
      } else {
        error('Failed to load startups.');
      }
    } catch (err) {
      error('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': return <span className="badge bg-green-100 text-green-800">Active</span>;
      case 'Pending Review': return <span className="badge bg-yellow-100 text-yellow-800">Pending</span>;
      case 'On Hold': return <span className="badge bg-orange-100 text-orange-800">On Hold</span>;
      case 'Graduated': return <span className="badge bg-purple-100 text-purple-800">Graduated</span>;
      case 'Rejected': return <span className="badge bg-red-100 text-red-800">Rejected</span>;
      default: return <span className="badge bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Startup Registry</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all incubated companies</p>
        </div>
        <button className="btn-primary flex items-center"><Building2 className="w-4 h-4 mr-2" /> Add Startup</button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, founder or email..." 
              className="input-field pl-10 w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="h-5 w-5 text-gray-400" />
            <select className="input-field py-2" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending Review">Pending Review</option>
              <option value="On Hold">On Hold</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Startup Name & Industry</th>
                <th className="p-4 font-semibold">Primary Contact</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Members</th>
                <th className="p-4 font-semibold">Joined</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500"><div className="animate-pulse flex flex-col items-center"><div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>Loading records...</div></td></tr>
              ) : startups.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No startups found matching your criteria.</td></tr>
              ) : (
                startups.map(startup => (
                  <tr key={startup.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-primary">{startup.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{startup.industry} • {startup.stage}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{startup.contact_name}</div>
                      <div className="text-xs text-gray-500">{startup.contact_email}</div>
                    </td>
                    <td className="p-4">{getStatusBadge(startup.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center text-gray-600"><Building2 className="w-4 h-4 mr-1.5" /> {startup.members?.length || 0} / {startup.team_members_count}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {startup.onboarding_date ? <div className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> {startup.onboarding_date}</div> : <span className="text-gray-400">Not Onboarded</span>}
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/admin/startups/${startup.id}`} className="btn-secondary text-sm py-1.5 px-3 inline-flex items-center">
                        <FileText className="w-4 h-4 mr-1.5" /> Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StartupRegistry;
