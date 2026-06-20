namespace HotelBooking.API.DTOs;

// ─── Auth DTOs ───────────────────────────────────────────
public record RegisterRequest(
    string FullName,
    string Email,
    string Password,
    string Phone
);

public record LoginRequest(
    string Email,
    string Password
);

public record AuthResponse(
    string Token,
    string FullName,
    string Email,
    string Role
);

// ─── Room DTOs ───────────────────────────────────────────
public record RoomResponse(
    int Id,
    string RoomNumber,
    string RoomType,
    string Description,
    decimal PricePerNight,
    int MaxOccupancy,
    string ImageUrl,
    bool IsAvailable,
    List<string> Amenities
);

public record RoomCreateRequest(
    string RoomNumber,
    string RoomType,
    string Description,
    decimal PricePerNight,
    int MaxOccupancy,
    string ImageUrl,
    List<int> AmenityIds
);

public record RoomAvailabilityRequest(
    DateTime CheckIn,
    DateTime CheckOut,
    int Guests
);

// ─── Booking DTOs ────────────────────────────────────────
public record BookingCreateRequest(
    int RoomId,
    DateTime CheckInDate,
    DateTime CheckOutDate,
    int Guests,
    string SpecialRequests
);

public record BookingResponse(
    int Id,
    string GuestName,
    string GuestEmail,
    RoomResponse Room,
    DateTime CheckInDate,
    DateTime CheckOutDate,
    int Guests,
    decimal TotalAmount,
    string Status,
    string SpecialRequests,
    DateTime CreatedAt
);

public record BookingStatusUpdate(string Status);

// ─── Payment DTOs ────────────────────────────────────────
public record PaymentRequest(
    int BookingId,
    string Method,
    string TransactionId
);

public record PaymentResponse(
    int Id,
    int BookingId,
    decimal Amount,
    string Method,
    string Status,
    string TransactionId,
    DateTime PaidAt
);

// ─── Dashboard DTOs ──────────────────────────────────────
public record DashboardStats(
    int TotalRooms,
    int AvailableRooms,
    int TotalBookings,
    int PendingBookings,
    int TodayCheckIns,
    int TodayCheckOuts,
    decimal MonthlyRevenue,
    decimal TotalRevenue
);
