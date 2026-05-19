import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Calendar, Users, Briefcase } from 'lucide-react';

const ResourceTracker = () => {
  const { token } = useAuth();
  const { error } = useToast();
  const [seats, setSeats] = useState([]);
  const [boardRooms, setBoardRooms] = useState([]);
  const [todayBookings, setTodayBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const [seatRes, roomRes, bookingRes] = await Promise.all([
        fetch('/api/resources/seats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/resources/boardrooms', { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`/api/resources/bookings?date=${new Date().toISOString().split('T')[0]}`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      if (seatRes.ok && roomRes.ok && bookingRes.ok) {
        const sd = await seatRes.json();
        const rd = await roomRes.json();
        const bd = await bookingRes.json();
        setSeats(sd.seats);
        setBoardRooms(rd.boardRooms);
        setTodayBookings(bd.bookings);
      }
    } catch (err) {
      error('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  const zones = [...new Set(seats.map(s => s.zone))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resource Tracker</h1>
        <p className="text-sm text-gray-500 mt-1">Manage office seating and board room reservations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seat Allocation Map */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-6">
            <h3 className="text-lg font-bold text-primary flex items-center"><Briefcase className="w-5 h-5 mr-2" /> Seat Allocations</h3>
            <div className="flex space-x-3 text-xs font-medium">
              <div className="flex items-center"><div className="w-3 h-3 rounded bg-green-500 mr-1.5"></div>Occupied</div>
              <div className="flex items-center"><div className="w-3 h-3 rounded bg-gray-200 border border-gray-300 mr-1.5"></div>Vacant</div>
            </div>
          </div>
          
          <div className="space-y-8">
            {zones.map(zone => (
              <div key={zone}>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{zone}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {seats.filter(s => s.zone === zone).map(seat => (
                    <div key={seat.id} className={`p-4 rounded-xl border-2 transition-all ${seat.status === 'Occupied' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer'}`}>
                      <div className="font-bold text-gray-800 text-center">{seat.label.split(' - ')[1]}</div>
                      <div className="text-xs text-center mt-2 font-medium truncate">
                        {seat.status === 'Occupied' ? <span className="text-primary">{seat.startup?.name}</span> : <span className="text-gray-400">Available</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Board Room Bookings */}
        <div className="space-y-6">
          <div className="card p-6 bg-primary text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center"><Calendar className="w-5 h-5 mr-2 text-primary-light" /> Today's Bookings</h3>
            {todayBookings.length === 0 ? (
              <p className="text-blue-200 text-sm">No board room bookings for today.</p>
            ) : (
              <ul className="space-y-4">
                {todayBookings.map(b => (
                  <li key={b.id} className="bg-white/10 rounded-lg p-3 border border-white/20">
                    <div className="font-medium text-white flex justify-between">
                      <span>{b.start_time} - {b.end_time}</span>
                      <span className="text-accent-light text-xs bg-white/20 px-2 py-0.5 rounded-full">{b.boardRoom?.name.split(' ')[0]}</span>
                    </div>
                    <div className="text-sm text-blue-100 mt-1">{b.startup?.name}</div>
                    <div className="text-xs text-blue-200 mt-1 truncate">{b.purpose}</div>
                  </li>
                ))}
              </ul>
            )}
            <button className="btn-accent w-full mt-6 flex justify-center items-center py-2"><Calendar className="w-4 h-4 mr-2" /> Book a Room</button>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center"><Users className="w-5 h-5 mr-2" /> Facilities</h3>
            <ul className="divide-y">
              {boardRooms.map(room => (
                <li key={room.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{room.name}</p>
                    <p className="text-xs text-gray-500">{room.location}</p>
                  </div>
                  <span className="badge bg-blue-50 text-blue-700 border border-blue-200">{room.capacity} seats</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceTracker;
