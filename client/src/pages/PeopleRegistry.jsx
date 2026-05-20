import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Download, Search, Check, X, Shield, Wifi, UserPlus } from 'lucide-react';

const PeopleRegistry = () => {
  const { token } = useAuth();
  const { error } = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHRPending, setFilterHRPending] = useState(false);
  const [filterITPending, setFilterITPending] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [searchTerm, filterHRPending, filterITPending]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const url = new URL('/api/members', baseUrl);
      if (searchTerm) url.searchParams.append('search', searchTerm);
      if (filterHRPending) url.searchParams.append('hr_pending', 'true');
      if (filterITPending) url.searchParams.append('it_pending', 'true');
      
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members);
      } else {
        error('Failed to load roster.');
      }
    } catch (err) {
      error('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = ({ status }) => (
    status ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">People Registry</h1>
          <p className="text-sm text-gray-500 mt-1">HR and IT tracking roster for all incubated individuals</p>
        </div>
        <div className="flex space-x-3">
          <a href={`${import.meta.env.VITE_API_URL || ''}/api/members/export?token=${token}`} target="_blank" rel="noreferrer" className="btn-secondary flex items-center">
            <Download className="w-4 h-4 mr-2" /> CSV Export
          </a>
          <button className="btn-primary flex items-center"><UserPlus className="w-4 h-4 mr-2" /> Add Member</button>
        </div>
      </div>

      <div className="card p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search members by name or email..." 
              className="input-field pl-10 w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4 w-full md:w-auto">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input type="checkbox" className="rounded text-primary focus:ring-primary" checked={filterHRPending} onChange={e => setFilterHRPending(e.target.checked)} />
              <span>Pending HR (IDs/Access)</span>
            </label>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
              <input type="checkbox" className="rounded text-primary focus:ring-primary" checked={filterITPending} onChange={e => setFilterITPending(e.target.checked)} />
              <span>Pending IT (System/WiFi)</span>
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200 text-gray-600 text-xs uppercase tracking-wider">
                <th className="p-3 font-semibold">Individual</th>
                <th className="p-3 font-semibold">Startup</th>
                <th className="p-3 font-semibold text-center border-l bg-blue-50/50">ID Card</th>
                <th className="p-3 font-semibold text-center bg-blue-50/50">Access Card</th>
                <th className="p-3 font-semibold text-center border-l bg-purple-50/50">System</th>
                <th className="p-3 font-semibold text-center bg-purple-50/50 border-r">WiFi Access</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading roster...</td></tr>
              ) : members.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No members found matching criteria.</td></tr>
              ) : (
                members.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-gray-900">{member.full_name}</div>
                      <div className="text-gray-500 text-xs">{member.email}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-primary">{member.startup?.name}</span>
                      <span className="block text-xs text-gray-500">{member.role}</span>
                    </td>
                    <td className="p-3 text-center border-l"><StatusIcon status={member.id_card_issued} /></td>
                    <td className="p-3 text-center">
                      <StatusIcon status={member.access_card_issued} />
                      {member.access_card_number && <span className="block text-[10px] text-gray-400 mt-1">{member.access_card_number}</span>}
                    </td>
                    <td className="p-3 text-center border-l">
                      <StatusIcon status={member.system_assigned} />
                      {member.system_id && <span className="block text-[10px] text-gray-400 mt-1">{member.system_id}</span>}
                    </td>
                    <td className="p-3 text-center border-r">
                      <StatusIcon status={member.wifi_access_granted} />
                      {member.wifi_username && <span className="block text-[10px] text-gray-400 mt-1">{member.wifi_username}</span>}
                    </td>
                    <td className="p-3 text-right">
                      <button className="text-accent hover:text-emerald-700 font-medium px-2 py-1 rounded hover:bg-emerald-50 transition-colors">Manage</button>
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

export default PeopleRegistry;
