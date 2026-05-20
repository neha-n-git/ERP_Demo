import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Edit, Mail, Phone, ExternalLink, Calendar, MapPin, Building, CheckCircle, Clock, Save, FileText, User } from 'lucide-react';

const StartupDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchStartup();
  }, [id]);

  const fetchStartup = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/startups/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setStartup(data.startup);
        setEditForm(data.startup);
      } else {
        error('Startup not found.');
        navigate('/admin/startups');
      }
    } catch (err) {
      error('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || '') + `/api/startups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const data = await res.json();
        setStartup(data.startup);
        setIsEditing(false);
        success('Startup details updated successfully.');
      } else {
        error('Failed to update startup.');
      }
    } catch (err) {
      error('Failed to update.');
    }
  };

  if (loading || !startup) return <div className="p-8 text-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div></div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/admin/startups" className="p-2 mr-3 bg-white rounded-lg border hover:bg-gray-50 transition-colors"><ArrowLeft className="w-5 h-5 text-gray-600" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{startup.name}</h1>
            <div className="flex items-center mt-1 space-x-3">
              <span className={`badge ${startup.status === 'Active' ? 'bg-green-100 text-green-800' : startup.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{startup.status}</span>
              <span className="text-sm text-gray-500 font-medium">{startup.industry}</span>
            </div>
          </div>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn-secondary flex items-center"><Edit className="w-4 h-4 mr-2" /> Edit Details</button>
        ) : (
          <div className="flex space-x-3">
            <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleUpdate} className="btn-primary flex items-center"><Save className="w-4 h-4 mr-2" /> Save Changes</button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-primary border-b pb-3 mb-4">Company Profile</h3>
            {isEditing ? (
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Name</label><input type="text" className="input-field" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Status</label>
                  <select className="input-field" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                    {['Pending Review', 'Active', 'On Hold', 'Graduated', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea className="input-field" rows={3} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Onboarding Date</label><input type="date" className="input-field" value={editForm.onboarding_date || ''} onChange={e => setEditForm({...editForm, onboarding_date: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">Assigned Seat Zone</label><input type="text" className="input-field" value={editForm.assigned_seat || ''} onChange={e => setEditForm({...editForm, assigned_seat: e.target.value})} /></div>
                <div className="col-span-2"><label className="block text-sm font-medium mb-1">Internal Notes</label><textarea className="input-field" rows={3} value={editForm.notes || ''} onChange={e => setEditForm({...editForm, notes: e.target.value})} /></div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{startup.description}</p>
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 pt-4 border-t">
                  <div><span className="block text-sm text-gray-500">Stage</span><span className="font-medium text-gray-900">{startup.stage}</span></div>
                  <div><span className="block text-sm text-gray-500">Year Founded</span><span className="font-medium text-gray-900">{startup.year_founded || 'N/A'}</span></div>
                  <div><span className="block text-sm text-gray-500">Website</span>{startup.website ? <a href={startup.website} target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline flex items-center">{startup.website} <ExternalLink className="w-3 h-3 ml-1" /></a> : 'N/A'}</div>
                  <div><span className="block text-sm text-gray-500">Referral Source</span><span className="font-medium text-gray-900">{startup.referral_source || 'N/A'}</span></div>
                  <div><span className="block text-sm text-gray-500">Resources Requested</span><span className="font-medium text-gray-900">{Array.isArray(startup.resources_needed) ? startup.resources_needed.join(', ') : 'None'}</span></div>
                </div>
                {startup.notes && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                    <span className="block text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">Internal Notes</span>
                    <p className="text-sm text-yellow-900">{startup.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="card p-6">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-lg font-bold text-primary">Team Members ({startup.members?.length || 0})</h3>
              <Link to={`/admin/people?startup_id=${startup.id}`} className="text-sm text-accent font-medium hover:underline">View Roster</Link>
            </div>
            {startup.members && startup.members.length > 0 ? (
              <ul className="divide-y">
                {startup.members.map(m => (
                  <li key={m.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{m.full_name}</p>
                      <p className="text-sm text-gray-500">{m.role || 'Member'}</p>
                    </div>
                    {m.status === 'Active' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Clock className="w-5 h-5 text-gray-400" />}
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-500 text-sm">No members registered yet.</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-primary border-b pb-3 mb-4">Primary Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center"><User className="w-5 h-5 text-gray-400 mr-3" /><div><p className="font-medium text-gray-900">{startup.contact_name}</p><p className="text-sm text-gray-500">{startup.contact_designation || 'Founder'}</p></div></div>
              <div className="flex items-center"><Mail className="w-5 h-5 text-gray-400 mr-3" /><a href={`mailto:${startup.contact_email}`} className="text-sm font-medium text-accent hover:underline">{startup.contact_email}</a></div>
              <div className="flex items-center"><Phone className="w-5 h-5 text-gray-400 mr-3" /><span className="text-sm font-medium text-gray-900">{startup.contact_phone}</span></div>
            </div>
          </div>
          
          <div className="card p-6">
            <h3 className="text-lg font-bold text-primary border-b pb-3 mb-4">Logistics</h3>
            <div className="space-y-4">
              <div className="flex items-start"><Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" /><div><p className="text-sm text-gray-500">Onboarding Date</p><p className="font-medium text-gray-900">{startup.onboarding_date || 'Not set'}</p></div></div>
              <div className="flex items-start"><MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" /><div><p className="text-sm text-gray-500">Seat Allocation</p><p className="font-medium text-gray-900">{startup.assigned_seat || 'Not assigned'}</p></div></div>
              <div className="flex items-start"><Building className="w-5 h-5 text-gray-400 mr-3 mt-0.5" /><div><p className="text-sm text-gray-500">Postal Address Usage</p>
                <div className="flex items-center mt-1">
                  <div className={`w-2.5 h-2.5 rounded-full mr-2 ${startup.postal_address_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="font-medium text-gray-900">{startup.postal_address_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div></div>
            </div>
          </div>

          {startup.pitch_deck_path && (
            <div className="card p-6 bg-primary text-white">
              <h3 className="text-lg font-bold mb-2 flex items-center"><FileText className="w-5 h-5 mr-2 text-primary-light" /> Documents</h3>
              <p className="text-sm text-blue-100 mb-4">Pitch deck / Company profile submitted during registration.</p>
              <a href={`${import.meta.env.VITE_API_URL || ''}/uploads/pitch_decks/${startup.pitch_deck_path}`} target="_blank" rel="noreferrer" className="btn-accent w-full flex justify-center py-2.5 bg-white text-primary hover:bg-gray-100 shadow-none border-0">View Pitch Deck (PDF)</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartupDetail;
