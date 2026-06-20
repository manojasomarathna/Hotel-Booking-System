import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { roomsAPI } from '../api';
import RoomCard from '../components/RoomCard';
import { Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const ROOM_TYPES = ['All', 'Single', 'Double', 'Deluxe', 'Suite'];

export default function RoomsPage() {
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState({
    checkIn: location.state?.checkIn || '',
    checkOut: location.state?.checkOut || '',
    guests: location.state?.guests || 1
  });
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (location.state?.checkIn) {
      handleSearch();
    } else {
      fetchAll();
    }
  }, []);

  const fetchAll = async () => {
    try {
      const { data } = await roomsAPI.getAll();
      setRooms(data);
    } catch {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!search.checkIn || !search.checkOut) {
      fetchAll();
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await roomsAPI.search({
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        guests: search.guests
      });
      setRooms(data);
      setSearched(true);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = filter === 'All' ? rooms : rooms.filter(r => r.roomType === filter);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Our Rooms</h1>
        <p className="text-slate-500 mb-8">Find the perfect room for your stay</p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 flex flex-wrap gap-3 mb-8 shadow-sm">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-slate-500 text-xs font-semibold mb-1">CHECK IN</label>
            <input type="date" value={search.checkIn} onChange={e => setSearch({...search, checkIn: e.target.value})}
              className="w-full text-slate-800 outline-none text-sm" min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-slate-500 text-xs font-semibold mb-1">CHECK OUT</label>
            <input type="date" value={search.checkOut} onChange={e => setSearch({...search, checkOut: e.target.value})}
              className="w-full text-slate-800 outline-none text-sm" min={search.checkIn} />
          </div>
          <div className="min-w-[120px]">
            <label className="block text-slate-500 text-xs font-semibold mb-1">GUESTS</label>
            <select value={search.guests} onChange={e => setSearch({...search, guests: parseInt(e.target.value)})}
              className="w-full text-slate-800 outline-none text-sm bg-transparent">
              {[1,2,3,4].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-2 rounded-xl flex items-center gap-2 text-sm transition-colors self-end">
            <Search size={16} /> Search
          </button>
          {searched && (
            <button type="button" onClick={() => { setSearch({checkIn:'',checkOut:'',guests:1}); setSearched(false); fetchAll(); }}
              className="border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm text-slate-600 transition-colors self-end">
              Clear
            </button>
          )}
        </form>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          <SlidersHorizontal size={16} className="text-slate-400" />
          {ROOM_TYPES.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === t ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Results */}
        {searched && (
          <p className="text-slate-600 mb-4 text-sm">
            Found <strong>{filteredRooms.length}</strong> available rooms
            {search.checkIn && ` from ${new Date(search.checkIn).toLocaleDateString()} to ${new Date(search.checkOut).toLocaleDateString()}`}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-lg font-medium">No rooms found</p>
            <p className="text-sm mt-1">Try different dates or fewer guests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => <RoomCard key={room.id} room={room} />)}
          </div>
        )}
      </div>
    </div>
  );
}
