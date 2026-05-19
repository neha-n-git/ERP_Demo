import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CreditCard, Send, Plus, Filter, IndianRupee, BellRing, Settings } from 'lucide-react';

const PaymentsTracker = () => {
  const { token } = useAuth();
  const { success, error, info } = useToast();
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
  const [remindingId, setRemindingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, [monthFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [payRes, sumRes] = await Promise.all([
        fetch(`/api/payments?billing_month=${monthFilter}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/payments/summary?month=${monthFilter}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (payRes.ok && sumRes.ok) {
        const pd = await payRes.json();
        const sd = await sumRes.json();
        setPayments(pd.payments);
        setSummary(sd);
      } else {
        error('Failed to load payment records.');
      }
    } catch (err) {
      error('Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemind = async (paymentId) => {
    setRemindingId(paymentId);
    try {
      const res = await fetch(`/api/payments/${paymentId}/remind`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        success('Reminder email sent successfully.');
      } else {
        error('Failed to send reminder.');
      }
    } catch (err) {
      error('Network error.');
    } finally {
      setRemindingId(null);
    }
  };

  const handleGenerateInvoices = async () => {
    info(`Generating invoices for ${monthFilter}...`);
    try {
      const res = await fetch('/api/payments/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ billing_month: monthFilter })
      });
      if (res.ok) {
        const data = await res.json();
        success(data.message);
        fetchData();
      } else {
        error('Failed to generate invoices.');
      }
    } catch (err) {
      error('Network error.');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Paid': return <span className="badge bg-green-100 text-green-800">Paid</span>;
      case 'Partial': return <span className="badge bg-orange-100 text-orange-800">Partial</span>;
      case 'Pending': return <span className="badge bg-red-100 text-red-800">Pending</span>;
      default: return <span className="badge bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Billing</h1>
          <p className="text-sm text-gray-500 mt-1">Track monthly dues and send invoice reminders</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center"><Settings className="w-4 h-4 mr-2" /> Billing Settings</button>
          <button onClick={handleGenerateInvoices} className="btn-primary flex items-center"><Plus className="w-4 h-4 mr-2" /> Auto-Generate Invoices</button>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 bg-white border-l-4 border-blue-500">
            <div className="text-gray-500 text-sm font-medium mb-1">Total Billed</div>
            <div className="text-2xl font-bold text-gray-900">₹{parseFloat(summary.totalBilled).toLocaleString()}</div>
          </div>
          <div className="card p-6 bg-white border-l-4 border-green-500">
            <div className="text-gray-500 text-sm font-medium mb-1">Amount Collected</div>
            <div className="text-2xl font-bold text-gray-900">₹{parseFloat(summary.totalCollected).toLocaleString()}</div>
          </div>
          <div className="card p-6 bg-white border-l-4 border-red-500">
            <div className="text-gray-500 text-sm font-medium mb-1">Outstanding Balance</div>
            <div className="text-2xl font-bold text-red-600">₹{parseFloat(summary.totalOutstanding).toLocaleString()}</div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400" />
            <input 
              type="month" 
              className="input-field py-2 w-48"
              value={monthFilter}
              onChange={e => setMonthFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200 text-gray-600 text-sm">
                <th className="p-4 font-semibold">Startup</th>
                <th className="p-4 font-semibold text-right">Seat Dues</th>
                <th className="p-4 font-semibold text-right">Extras</th>
                <th className="p-4 font-semibold text-right">Total Billed</th>
                <th className="p-4 font-semibold text-right">Paid</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading payments...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No invoices generated for this month.</td></tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-primary">{payment.startup?.name}</div>
                      <div className="text-xs text-gray-500">{payment.billing_month}</div>
                    </td>
                    <td className="p-4 text-right text-sm">₹{payment.seat_charges}</td>
                    <td className="p-4 text-right text-sm">
                      <span className="block">₹{payment.additional_charges}</span>
                      {payment.additional_charges_notes && <span className="block text-[10px] text-gray-400 truncate w-24 ml-auto" title={payment.additional_charges_notes}>{payment.additional_charges_notes}</span>}
                    </td>
                    <td className="p-4 text-right font-bold text-gray-900">₹{payment.total_amount}</td>
                    <td className="p-4 text-right text-sm font-medium text-green-600">₹{payment.amount_paid}</td>
                    <td className="p-4 text-center">{getStatusBadge(payment.status)}</td>
                    <td className="p-4 text-right">
                      {payment.status !== 'Paid' && (
                        <button 
                          onClick={() => handleRemind(payment.id)}
                          disabled={remindingId === payment.id}
                          className="btn-accent text-xs py-1.5 px-3 flex items-center ml-auto"
                        >
                          {remindingId === payment.id ? (
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          ) : (
                            <BellRing className="w-3 h-3 mr-1" />
                          )}
                          Remind
                        </button>
                      )}
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

export default PaymentsTracker;
