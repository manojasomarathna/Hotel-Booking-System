import { Link } from 'react-router-dom';
import { Users, Star, Wifi, Wind, Waves, Coffee } from 'lucide-react';

const amenityIcons = { 'Free WiFi': Wifi, 'Air Conditioning': Wind, 'Swimming Pool': Waves, 'Breakfast Included': Coffee };

const roomColors = {
  Single: 'bg-blue-100 text-blue-700',
  Double: 'bg-emerald-100 text-emerald-700',
  Deluxe: 'bg-purple-100 text-purple-700',
  Suite: 'bg-amber-100 text-amber-700',
};

export default function RoomCard({ room }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative h-52 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl">🏨</span>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roomColors[room.roomType] || 'bg-gray-100 text-gray-700'}`}>
            {room.roomType}
          </span>
        </div>
        {!room.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Not Available</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Room {room.roomNumber}</h3>
            <p className="text-slate-500 text-sm mt-0.5 line-clamp-2">{room.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-3 mb-4">
          <Users size={14} />
          <span>Up to {room.maxOccupancy} guests</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities?.slice(0, 3).map((a) => {
            const Icon = amenityIcons[a] || Star;
            return (
              <span key={a} className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                <Icon size={11} />
                {a}
              </span>
            );
          })}
          {room.amenities?.length > 3 && (
            <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
              +{room.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <span className="text-2xl font-bold text-slate-800">${room.pricePerNight}</span>
            <span className="text-slate-400 text-sm"> / night</span>
          </div>
          {room.isAvailable ? (
            <Link
              to={`/rooms/${room.id}`}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
            >
              Book Now
            </Link>
          ) : (
            <button disabled className="bg-slate-200 text-slate-400 font-semibold px-4 py-2 rounded-xl text-sm cursor-not-allowed">
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
