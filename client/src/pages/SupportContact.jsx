import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LifeBuoy, Mail, Wrench, Shield, Zap, Send } from 'lucide-react';

const SupportContact = () => {
  const { token } = useAuth();
  const { success, error } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Mentoring Form State
  const [mentoringForm, setMentoringForm] = useState({ startup_name: '', contact_person: '', description: '', preferred_dates: '' });
  const [sendingMentoring, setSendingMentoring] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/support/tickets', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
      }
    } catch (err) {
      error('Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMentoring = async (e) => {
    e.preventDefault();
    setSendingMentoring(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + '/api/support/mentoring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(mentoringForm)
      });
      if (res.ok) {
        success('Mentoring request dispatched successfully to enquiry@sjhif.in');
        setMentoringForm({ startup_name: '', contact_person: '', description: '', preferred_dates: '' });
      } else {
        error('Failed to dispatch mentoring request.');
      }
    } catch (err) {
      error('Network error.');
    } finally {
      setSendingMentoring(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Resolved') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'In Progress') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const getTypeIcon = (type) => {
    if (type === 'IT') return <Zap className="w-4 h-4 text-blue-500" />;
    if (type === 'HR') return <Shield className="w-4 h-4 text-purple-500" />;
    if (type === 'Facilities') return <Wrench className="w-4 h-4 text-orange-500" />;
    return <LifeBuoy className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support & Contact</h1>
        <p className="text-sm text-gray-500 mt-1">Manage help desk tickets and request external mentoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Help Desk Tickets */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-6">
            <h3 className="text-lg font-bold text-primary flex items-center"><LifeBuoy className="w-5 h-5 mr-2" /> Help Desk Log</h3>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-gray-500 py-8">Loading tickets...</p>
            ) : tickets.length === 0 ? (
              <p className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">No support tickets found.</p>
            ) : (
              tickets.map(ticket => (
                <div key={ticket.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-gray-50 border mr-3">{getTypeIcon(ticket.type)}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{ticket.subject}</h4>
                        <p className="text-sm text-primary font-medium">{ticket.startup?.name}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-3 ml-12">{ticket.description}</p>
                  {ticket.notes && (
                    <div className="mt-3 ml-12 p-3 bg-yellow-50 border border-yellow-100 rounded text-sm text-yellow-800">
                      <strong>Admin Notes:</strong> {ticket.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mentoring Request Form */}
        <div className="space-y-6">
          <div className="card p-6 bg-primary text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center"><Mail className="w-5 h-5 mr-2 text-primary-light" /> Dispatch Mentoring Request</h3>
            <p className="text-sm text-blue-100 mb-6 leading-relaxed">Fill this out to generate a templated email request sent to <span className="font-semibold text-white">enquiry@sjhif.in</span> on behalf of a startup.</p>
            
            <form onSubmit={handleSendMentoring} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1 uppercase tracking-wider">Startup Name</label>
                <input type="text" required className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded focus:outline-none focus:border-white text-white placeholder-blue-300 text-sm" value={mentoringForm.startup_name} onChange={e => setMentoringForm({...mentoringForm, startup_name: e.target.value})} placeholder="e.g. MedPulse AI" />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1 uppercase tracking-wider">Contact Person</label>
                <input type="text" required className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded focus:outline-none focus:border-white text-white placeholder-blue-300 text-sm" value={mentoringForm.contact_person} onChange={e => setMentoringForm({...mentoringForm, contact_person: e.target.value})} placeholder="e.g. Dr. Arjun Mehta" />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1 uppercase tracking-wider">Mentoring Needed</label>
                <textarea required rows={3} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded focus:outline-none focus:border-white text-white placeholder-blue-300 text-sm" value={mentoringForm.description} onChange={e => setMentoringForm({...mentoringForm, description: e.target.value})} placeholder="Describe the domain expertise required..."></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-200 mb-1 uppercase tracking-wider">Preferred Dates</label>
                <input type="text" className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded focus:outline-none focus:border-white text-white placeholder-blue-300 text-sm" value={mentoringForm.preferred_dates} onChange={e => setMentoringForm({...mentoringForm, preferred_dates: e.target.value})} placeholder="e.g. Next week" />
              </div>
              <button type="submit" disabled={sendingMentoring} className="btn-accent w-full py-2.5 mt-2 flex justify-center items-center shadow-lg">
                {sendingMentoring ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <><Send className="w-4 h-4 mr-2" /> Dispatch Request</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportContact;
