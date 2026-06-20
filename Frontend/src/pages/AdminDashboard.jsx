import { useState, useEffect } from 'react';
import { bookingsAPI } from '../api';
import { format } from 'date-fns';
import { BedDouble, Users, TrendingUp, Clock, CheckCircle, XCircle, DollarSign, CalendarCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const statusStyles = {
  Pending:   'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Completed: 'bg-blue-100 text-blue-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([bookingsAPI.getDashboard(), bookingsAPI.getAll()])
      .then(([{ data: s }, { data: b }]) => { setStats(s); setBookings(b); })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await bookingsAPI.updateStatus(id, status);
      setBookings(prev => prev.map(b => b.id === id ? {...b, status} : b));
      toast.success(`Booking ${status.toLowerCase()}`);
    } catch {
      toast.error('Update failed');
    }
  };

  const filteredBookings = tab === 'all' ? bookings : bookings.filter(b => b.status === tab);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Rooms', value: stats.totalRooms, icon: BedDouble, color: 'bg-blue-500' },
              { label: 'Available', value: stats.availableRooms, icon: CheckCircle, color: 'bg-green-500' },
              { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'bg-purple-500' },
              { label: 'Pending', value: stats.pendingBookings, icon: Clock, color: 'bg-yellow-500' },
              { label: "Today's Check-ins", value: stats.todayCheckIns, icon: Users, color: 'bg-indigo-500' },
              { label: "Today's Check-outs", value: stats.todayCheckOuts, icon: TrendingUp, color: 'bg-pink-500' },
              { label: 'Monthly Revenue', value: `$${stats.monthlyRevenue.toFixed(0)}`, icon: DollarSign, color: 'bg-amber-500' },
              { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'bg-emerald-500' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
                <p className="text-slate-500 text-sm mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-xl mb-4">All Bookings</h2>
            <div className="flex gap-2 flex-wrap">
              {['all', 'Pending', 'Confirmed', 'Cancelled', 'Completed'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {t} {t === 'all' ? `(${bookings.length})` : `(${bookings.filter(b => b.status === t).length})`}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  {['#', 'Guest', 'Room', 'Check In', 'Check Out', 'Total', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-sm">#{b.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 text-sm">{b.guestName}</p>
                      <p className="text-slate-400 text-xs">{b.guestEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      Room {b.room.roomNumber} <span className="text-slate-400">({b.room.roomType})</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{format(new Date(b.checkInDate), 'dd MMM yy')}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{format(new Date(b.checkOutDate), 'dd MMM yy')}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">${b.totalAmount.toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {b.status === 'Pending' && (
                          <>
                            <button onClick={() => updateStatus(b.id, 'Confirmed')}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Confirm">
                              <CheckCircle size={16} />
                            </button>
                            <button onClick={() => updateStatus(b.id, 'Cancelled')}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {b.status === 'Confirmed' && (
                          <button onClick={() => updateStatus(b.id, 'Completed')}
                            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors">
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredBookings.length === 0 && (
              <div className="text-center py-12 text-slate-400">No bookings found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
