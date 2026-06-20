import { useState, useEffect } from 'react';
import { bookingsAPI } from '../api';
import { format } from 'date-fns';
import { Calendar, BedDouble, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const statusStyles = {
  Pending:   'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Completed: 'bg-blue-100 text-blue-700',
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsAPI.getMyBookings()
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    try {
      await bookingsAPI.updateStatus(id, 'Cancelled');
      setBookings(prev => prev.map(b => b.id === id ? {...b, status: 'Cancelled'} : b));
      toast.success('Booking cancelled');
    } catch {
      toast.error('Failed to cancel');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Bookings</h1>
        <p className="text-slate-500 mb-8">Track and manage your reservations</p>

        {bookings.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <BedDouble size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No bookings yet</p>
            <a href="/rooms" className="text-amber-600 text-sm hover:underline mt-2 inline-block">Browse available rooms →</a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-800 text-lg">Room {b.room.roomNumber} — {b.room.roomType}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[b.status]}`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm">Booking #{b.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">${b.totalAmount.toFixed(2)}</p>
                    <p className="text-slate-400 text-xs">Total amount</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={14} className="text-amber-500" />
                    <div>
                      <p className="text-xs text-slate-400">Check In</p>
                      <p className="font-medium">{format(new Date(b.checkInDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={14} className="text-amber-500" />
                    <div>
                      <p className="text-xs text-slate-400">Check Out</p>
                      <p className="font-medium">{format(new Date(b.checkOutDate), 'dd MMM yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign size={14} className="text-amber-500" />
                    <div>
                      <p className="text-xs text-slate-400">Per Night</p>
                      <p className="font-medium">${b.room.pricePerNight}</p>
                    </div>
                  </div>
                </div>

                {b.specialRequests && (
                  <p className="mt-3 text-sm text-slate-500 bg-slate-50 rounded-lg p-3">
                    <strong>Special Requests:</strong> {b.specialRequests}
                  </p>
                )}

                {b.status === 'Pending' && (
                  <div className="mt-4 flex justify-end">
                    <button onClick={() => handleCancel(b.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium border border-red-200 hover:bg-red-50 px-4 py-1.5 rounded-lg transition-colors">
                      Cancel Booking
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
