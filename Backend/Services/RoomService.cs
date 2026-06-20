using Microsoft.EntityFrameworkCore;
using HotelBooking.API.Data;
using HotelBooking.API.DTOs;
using HotelBooking.API.Models;

namespace HotelBooking.API.Services;

public interface IRoomService
{
    Task<List<RoomResponse>> GetAllRoomsAsync();
    Task<RoomResponse?> GetRoomByIdAsync(int id);
    Task<List<RoomResponse>> GetAvailableRoomsAsync(RoomAvailabilityRequest request);
    Task<RoomResponse> CreateRoomAsync(RoomCreateRequest request);
    Task<bool> UpdateRoomAvailabilityAsync(int id, bool isAvailable);
    Task<bool> DeleteRoomAsync(int id);
}

public class RoomService : IRoomService
{
    private readonly HotelDbContext _db;

    public RoomService(HotelDbContext db) => _db = db;

    public async Task<List<RoomResponse>> GetAllRoomsAsync()
    {
        return await _db.Rooms
            .Include(r => r.RoomAmenities)
            .ThenInclude(ra => ra.Amenity)
            .Select(r => MapToResponse(r))
            .ToListAsync();
    }

    public async Task<RoomResponse?> GetRoomByIdAsync(int id)
    {
        var room = await _db.Rooms
            .Include(r => r.RoomAmenities)
            .ThenInclude(ra => ra.Amenity)
            .FirstOrDefaultAsync(r => r.Id == id);

        return room == null ? null : MapToResponse(room);
    }

    public async Task<List<RoomResponse>> GetAvailableRoomsAsync(RoomAvailabilityRequest request)
    {
        var bookedRoomIds = await _db.Bookings
            .Where(b => b.Status != "Cancelled" &&
                        b.CheckInDate < request.CheckOut &&
                        b.CheckOutDate > request.CheckIn)
            .Select(b => b.RoomId)
            .ToListAsync();

        return await _db.Rooms
            .Include(r => r.RoomAmenities)
            .ThenInclude(ra => ra.Amenity)
            .Where(r => r.IsAvailable &&
                        r.MaxOccupancy >= request.Guests &&
                        !bookedRoomIds.Contains(r.Id))
            .Select(r => MapToResponse(r))
            .ToListAsync();
    }

    public async Task<RoomResponse> CreateRoomAsync(RoomCreateRequest request)
    {
        var room = new Room
        {
            RoomNumber = request.RoomNumber,
            RoomType = request.RoomType,
            Description = request.Description,
            PricePerNight = request.PricePerNight,
            MaxOccupancy = request.MaxOccupancy,
            ImageUrl = request.ImageUrl,
            IsAvailable = true
        };

        _db.Rooms.Add(room);
        await _db.SaveChangesAsync();

        foreach (var amenityId in request.AmenityIds)
        {
            _db.RoomAmenities.Add(new RoomAmenity { RoomId = room.Id, AmenityId = amenityId });
        }
        await _db.SaveChangesAsync();

        return (await GetRoomByIdAsync(room.Id))!;
    }

    public async Task<bool> UpdateRoomAvailabilityAsync(int id, bool isAvailable)
    {
        var room = await _db.Rooms.FindAsync(id);
        if (room == null) return false;
        room.IsAvailable = isAvailable;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteRoomAsync(int id)
    {
        var room = await _db.Rooms.FindAsync(id);
        if (room == null) return false;
        _db.Rooms.Remove(room);
        await _db.SaveChangesAsync();
        return true;
    }

    private static RoomResponse MapToResponse(Room room) => new(
        room.Id,
        room.RoomNumber,
        room.RoomType,
        room.Description,
        room.PricePerNight,
        room.MaxOccupancy,
        room.ImageUrl,
        room.IsAvailable,
        room.RoomAmenities.Select(ra => ra.Amenity.Name).ToList()
    );
}
