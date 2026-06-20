import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomsAPI, bookingsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { Users, Star, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ checkInDate: '', checkOutDate: '', guests: 1, specialRequests: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    roomsAPI.getById(id)
      .then(({ data }) => setRoom(data))
      .catch(() => toast.error('Room not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const nights = booking.checkInDate && booking.checkOutDate
    ? Math.max(0, Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / 86400000))
    : 0;

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (nights < 1) { toast.error('Please select valid dates'); return; }

    setSubmitting(true);
    try {
      const { data } = await bookingsAPI.create({ ...booking, roomId: room.id });
      toast.success('Booking confirmed! 🎉');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" /></div>;
  if (!room) return <div className="text-center py-20 text-slate-400">Room not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={18} /> Back to rooms
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl h-72 flex items-center justify-center">
              <span className="text-8xl">🏨</span>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-amber-600 font-semibold text-sm uppercase tracking-wider">{room.roomType}</span>
                  <h1 className="text-3xl font-bold text-slate-800 mt-1">Room {room.roomNumber}</h1>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-slate-800">${room.pricePerNight}</span>
                  <span className="text-slate-400 text-sm"> / night</span>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6">{room.description}</p>
              <div className="flex items-center gap-2 text-slate-500">
                <Users size={16} />
                <span>Up to {room.maxOccupancy} guests</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {room.amenities?.map(a => (
                  <div key={a} className="flex items-center gap-2 text-slate-600 text-sm">
                    <Star size={14} className="text-amber-500" />
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
              <h3 className="font-bold text-slate-800 text-xl mb-5">Book This Room</h3>

              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1.5">Check In</label>
                  <input type="date" required value={booking.checkInDate}
                    onChange={e => setBooking({...booking, checkInDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1.5">Check Out</label>
                  <input type="date" required value={booking.checkOutDate}
                    onChange={e => setBooking({...booking, checkOutDate: e.target.value})}
                    min={booking.checkInDate || new Date().toISOString().split('T')[0]}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1.5">Guests</label>
                  <select value={booking.guests} onChange={e => setBooking({...booking, guests: parseInt(e.target.value)})}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
                    {Array.from({length: room.maxOccupancy}, (_,i) => i+1).map(n =>
                      <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 text-sm font-medium mb-1.5">Special Requests</label>
                  <textarea value={booking.specialRequests} onChange={e => setBooking({...booking, specialRequests: e.target.value})}
                    placeholder="Any special requests..." rows={3}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
                </div>

                {nights > 0 && (
                  <div className="bg-amber-50 rounded-xl p-4 space-y-2 text-sm">
                    <div className="flex justify-between text-slate-600">
                      <span>${room.pricePerNight} × {nights} nights</span>
                      <span>${(room.pricePerNight * nights).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-800 text-base pt-2 border-t border-amber-200">
                      <span>Total</span>
                      <span className="text-amber-600">${(room.pricePerNight * nights).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={submitting || !room.isAvailable}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 font-bold py-3 rounded-xl transition-colors">
                  {submitting ? 'Booking...' : user ? 'Confirm Booking' : 'Login to Book'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
