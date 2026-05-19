import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Building, User, FileText, Upload, CheckCircle } from 'lucide-react';

const INITIAL_STATE = {
  name: '', industry: 'Health Tech', stage: 'Ideation', description: '', year_founded: '', website: '',
  contact_name: '', contact_designation: '', contact_email: '', contact_phone: '', contact_linkedin: '',
  team_members_count: 1, resources_needed: [], referral_source: 'Website'
};

const RESOURCES = ['Office Space', 'Board Room', 'Postal Address', 'Printing & Stationery', 'Mentoring', 'Grants', 'Networking'];

const PublicRegister = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmValid, setConfirmValid] = useState(false);

  const handleCheckbox = (res) => {
    setFormData(prev => ({
      ...prev,
      resources_needed: prev.resources_needed.includes(res) 
        ? prev.resources_needed.filter(r => r !== res)
        : [...prev.resources_needed, res]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmValid) return setErrorMsg('Please confirm the information provided is accurate.');
    
    setLoading(true);
    setErrorMsg('');
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'resources_needed') data.append(key, JSON.stringify(formData[key]));
      else data.append(key, formData[key]);
    });
    if (file) data.append('pitch_deck', file);

    try {
      const res = await fetch('/api/public/register', { method: 'POST', body: data });
      const result = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#0D2C54', '#10B981', '#ffffff'] });
      } else {
        setErrorMsg(result.error || 'Failed to submit application.');
      }
    } catch (err) {
      setErrorMsg('Cannot connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <div className="card max-w-lg w-full p-10 text-center shadow-xl">
          <CheckCircle className="w-20 h-20 text-accent mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-primary mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-8">Thank you for applying to the Demo Incubation Centre. Your application is now pending review. An acknowledgement has been sent to your email.</p>
          <button onClick={() => { setSuccess(false); setFormData(INITIAL_STATE); setFile(null); setConfirmValid(false); }} className="btn-secondary w-full py-3">Submit Another Application</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto card overflow-hidden shadow-xl">
        <div className="bg-primary px-8 py-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Startup Incubation Form</h1>
            <p className="mt-2 text-primary-light text-blue-100">Apply for incubation support at Demo Foundation.</p>
          </div>
          <div className="hidden sm:flex items-center justify-center h-14 w-14 bg-white rounded shadow text-primary">
            <Building className="w-8 h-8" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8 bg-white">
          {errorMsg && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-700">{errorMsg}</p>
            </div>
          )}

          {/* Company Details */}
          <div>
            <h3 className="text-lg font-medium text-primary border-b pb-2 mb-4 flex items-center"><Building className="w-5 h-5 mr-2" /> Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Startup Name *</label>
                <input type="text" required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry *</label>
                <select className="input-field" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
                  {['Health Tech', 'Medical Devices', 'Biotech', 'Digital Health', 'Nutrition', 'Other'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description (Max 500 chars) *</label>
                <textarea required maxLength={500} rows={3} className="input-field" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Stage *</label>
                <select className="input-field" value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})}>
                  {['Ideation', 'MVP', 'Early Revenue', 'Growth'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Founded</label>
                <input type="number" min="1990" max="2030" className="input-field" value={formData.year_founded} onChange={e => setFormData({...formData, year_founded: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Founder Details */}
          <div>
            <h3 className="text-lg font-medium text-primary border-b pb-2 mb-4 flex items-center"><User className="w-5 h-5 mr-2" /> Primary Contact / Founder</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" required className="input-field" value={formData.contact_name} onChange={e => setFormData({...formData, contact_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input type="text" className="input-field" value={formData.contact_designation} onChange={e => setFormData({...formData, contact_designation: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input type="email" required className="input-field" value={formData.contact_email} onChange={e => setFormData({...formData, contact_email: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" required className="input-field" value={formData.contact_phone} onChange={e => setFormData({...formData, contact_phone: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Requirements & Upload */}
          <div>
            <h3 className="text-lg font-medium text-primary border-b pb-2 mb-4 flex items-center"><FileText className="w-5 h-5 mr-2" /> Requirements & Documents</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resources Needed from Incubator (Check all that apply)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {RESOURCES.map(res => (
                    <label key={res} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" className="rounded text-accent focus:ring-accent" checked={formData.resources_needed.includes(res)} onChange={() => handleCheckbox(res)} />
                      <span className="text-sm font-medium text-gray-700">{res}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Team Size *</label>
                  <input type="number" required min="1" className="input-field" value={formData.team_members_count} onChange={e => setFormData({...formData, team_members_count: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                  <select className="input-field" value={formData.referral_source} onChange={e => setFormData({...formData, referral_source: e.target.value})}>
                    {['Referral', 'Website', 'Social Media', 'Event', 'Direct Call', 'Other'].map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Pitch Deck / Company Profile (PDF, Max 5MB)</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">{file ? <span className="font-semibold text-primary">{file.name}</span> : <span>Click to upload PDF</span>}</p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <label className="flex items-center space-x-3 mb-6 cursor-pointer">
              <input type="checkbox" required className="w-5 h-5 rounded text-accent focus:ring-accent" checked={confirmValid} onChange={e => setConfirmValid(e.target.checked)} />
              <span className="text-sm text-gray-700 font-medium">I confirm that all the information provided above is accurate and true to my knowledge.</span>
            </label>
            
            <button type="submit" disabled={loading || !confirmValid} className="btn-accent w-full py-4 text-lg">
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PublicRegister;
