import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Shield, Clock, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ checkIn: '', checkOut: '', guests: 1 });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/rooms', { state: search });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900 text-white py-32 px-4">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-amber-400 font-semibold tracking-widest text-sm uppercase mb-4">Sri Lanka's Premier Hotel</p>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Experience Luxury <br />
            <span className="text-amber-400">Like Never Before</span>
          </h1>
          <p className="text-slate-300 text-lg mb-12 max-w-2xl mx-auto">
            Discover our handcrafted rooms designed for comfort and elegance. Book your perfect stay today.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto shadow-2xl">
            <div className="flex-1">
              <label className="block text-slate-500 text-xs font-semibold mb-1 text-left px-1">CHECK IN</label>
              <input
                type="date"
                value={search.checkIn}
                onChange={e => setSearch({ ...search, checkIn: e.target.value })}
                className="w-full text-slate-800 font-medium outline-none text-sm px-1"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="w-px bg-slate-200 hidden md:block" />
            <div className="flex-1">
              <label className="block text-slate-500 text-xs font-semibold mb-1 text-left px-1">CHECK OUT</label>
              <input
                type="date"
                value={search.checkOut}
                onChange={e => setSearch({ ...search, checkOut: e.target.value })}
                className="w-full text-slate-800 font-medium outline-none text-sm px-1"
                min={search.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="w-px bg-slate-200 hidden md:block" />
            <div className="flex-1">
              <label className="block text-slate-500 text-xs font-semibold mb-1 text-left px-1">GUESTS</label>
              <select
                value={search.guests}
                onChange={e => setSearch({ ...search, guests: parseInt(e.target.value) })}
                className="w-full text-slate-800 font-medium outline-none text-sm bg-transparent"
              >
                {[1,2,3,4].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <Search size={18} />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Why Choose LuxeStay?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Star, title: "Premium Rooms", desc: "Handcrafted interiors with luxury amenities for an unforgettable stay." },
              { icon: Shield, title: "Secure Booking", desc: "Your bookings and payments are protected with enterprise-grade security." },
              { icon: Clock, title: "24/7 Support", desc: "Our dedicated team is available around the clock for all your needs." },
              { icon: HeartHandshake, title: "Best Price", desc: "Guaranteed best rates with no hidden fees or surprise charges." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-amber-600" size={28} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Types */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Room Types</h2>
          <p className="text-slate-500 mb-12">From cozy singles to lavish suites — find your perfect fit.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'Single', price: 'From $65', emoji: '🛏️', color: 'from-blue-500 to-blue-700' },
              { type: 'Double', price: 'From $120', emoji: '🛌', color: 'from-emerald-500 to-emerald-700' },
              { type: 'Deluxe', price: 'From $180', emoji: '🌟', color: 'from-purple-500 to-purple-700' },
              { type: 'Suite', price: 'From $350', emoji: '👑', color: 'from-amber-500 to-orange-600' },
            ].map(({ type, price, emoji, color }) => (
              <div key={type} className={`bg-gradient-to-br ${color} text-white rounded-2xl p-6 text-center hover:scale-105 transition-transform cursor-pointer`}
                onClick={() => navigate('/rooms')}>
                <div className="text-4xl mb-3">{emoji}</div>
                <h3 className="font-bold text-lg">{type}</h3>
                <p className="text-white/80 text-sm mt-1">{price} / night</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
