using Microsoft.EntityFrameworkCore;
using HotelBooking.API.Data;
using HotelBooking.API.DTOs;
using HotelBooking.API.Models;

namespace HotelBooking.API.Services;

public interface IBookingService
{
    Task<BookingResponse?> CreateBookingAsync(int userId, BookingCreateRequest request);
    Task<List<BookingResponse>> GetAllBookingsAsync();
    Task<List<BookingResponse>> GetUserBookingsAsync(int userId);
    Task<BookingResponse?> GetBookingByIdAsync(int id);
    Task<bool> UpdateStatusAsync(int id, string status);
    Task<DashboardStats> GetDashboardStatsAsync();
}

public class BookingService : IBookingService
{
    private readonly HotelDbContext _db;

    public BookingService(HotelDbContext db) => _db = db;

    public async Task<BookingResponse?> CreateBookingAsync(int userId, BookingCreateRequest request)
    {
        var room = await _db.Rooms
            .Include(r => r.RoomAmenities).ThenInclude(ra => ra.Amenity)
            .FirstOrDefaultAsync(r => r.Id == request.RoomId);

        if (room == null) return null;

        // Check availability
        var conflict = await _db.Bookings.AnyAsync(b =>
            b.RoomId == request.RoomId &&
            b.Status != "Cancelled" &&
            b.CheckInDate < request.CheckOutDate &&
            b.CheckOutDate > request.CheckInDate);

        if (conflict) return null;

        var nights = (request.CheckOutDate - request.CheckInDate).Days;
        var totalAmount = nights * room.PricePerNight;

        var booking = new Booking
        {
            UserId = userId,
            RoomId = request.RoomId,
            CheckInDate = request.CheckInDate,
            CheckOutDate = request.CheckOutDate,
            Guests = request.Guests,
            TotalAmount = totalAmount,
            SpecialRequests = request.SpecialRequests,
            Status = "Pending"
        };

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();

        return await GetBookingByIdAsync(booking.Id);
    }

    public async Task<List<BookingResponse>> GetAllBookingsAsync()
    {
        return await _db.Bookings
            .Include(b => b.User)
            .Include(b => b.Room).ThenInclude(r => r.RoomAmenities).ThenInclude(ra => ra.Amenity)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => MapToResponse(b))
            .ToListAsync();
    }

    public async Task<List<BookingResponse>> GetUserBookingsAsync(int userId)
    {
        return await _db.Bookings
            .Include(b => b.User)
            .Include(b => b.Room).ThenInclude(r => r.RoomAmenities).ThenInclude(ra => ra.Amenity)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => MapToResponse(b))
            .ToListAsync();
    }

    public async Task<BookingResponse?> GetBookingByIdAsync(int id)
    {
        var booking = await _db.Bookings
            .Include(b => b.User)
            .Include(b => b.Room).ThenInclude(r => r.RoomAmenities).ThenInclude(ra => ra.Amenity)
            .FirstOrDefaultAsync(b => b.Id == id);

        return booking == null ? null : MapToResponse(booking);
    }

    public async Task<bool> UpdateStatusAsync(int id, string status)
    {
        var booking = await _db.Bookings.FindAsync(id);
        if (booking == null) return false;
        booking.Status = status;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<DashboardStats> GetDashboardStatsAsync()
    {
        var today = DateTime.UtcNow.Date;
        var monthStart = new DateTime(today.Year, today.Month, 1);

        return new DashboardStats(
            TotalRooms: await _db.Rooms.CountAsync(),
            AvailableRooms: await _db.Rooms.CountAsync(r => r.IsAvailable),
            TotalBookings: await _db.Bookings.CountAsync(),
            PendingBookings: await _db.Bookings.CountAsync(b => b.Status == "Pending"),
            TodayCheckIns: await _db.Bookings.CountAsync(b => b.CheckInDate.Date == today && b.Status == "Confirmed"),
            TodayCheckOuts: await _db.Bookings.CountAsync(b => b.CheckOutDate.Date == today && b.Status == "Confirmed"),
            MonthlyRevenue: await _db.Payments.Where(p => p.Status == "Completed" && p.PaidAt >= monthStart).SumAsync(p => p.Amount),
            TotalRevenue: await _db.Payments.Where(p => p.Status == "Completed").SumAsync(p => p.Amount)
        );
    }

    private static BookingResponse MapToResponse(Booking b) => new(
        b.Id,
        b.User.FullName,
        b.User.Email,
        new RoomResponse(
            b.Room.Id, b.Room.RoomNumber, b.Room.RoomType,
            b.Room.Description, b.Room.PricePerNight, b.Room.MaxOccupancy,
            b.Room.ImageUrl, b.Room.IsAvailable,
            b.Room.RoomAmenities.Select(ra => ra.Amenity.Name).ToList()
        ),
        b.CheckInDate, b.CheckOutDate, b.Guests,
        b.TotalAmount, b.Status, b.SpecialRequests, b.CreatedAt
    );
}
