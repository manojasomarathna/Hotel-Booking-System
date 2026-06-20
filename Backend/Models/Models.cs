namespace HotelBooking.API.Models;

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Guest"; // Admin, Guest
    public string Phone { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}

public class Room
{
    public int Id { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public string RoomType { get; set; } = string.Empty; // Single, Double, Suite, Deluxe
    public string Description { get; set; } = string.Empty;
    public decimal PricePerNight { get; set; }
    public int MaxOccupancy { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsAvailable { get; set; } = true;
    public ICollection<RoomAmenity> RoomAmenities { get; set; } = new List<RoomAmenity>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}

public class Amenity
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // WiFi, AC, Pool, etc.
    public string Icon { get; set; } = string.Empty;
    public ICollection<RoomAmenity> RoomAmenities { get; set; } = new List<RoomAmenity>();
}

public class RoomAmenity
{
    public int RoomId { get; set; }
    public Room Room { get; set; } = null!;
    public int AmenityId { get; set; }
    public Amenity Amenity { get; set; } = null!;
}

public class Booking
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int RoomId { get; set; }
    public Room Room { get; set; } = null!;
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int Guests { get; set; }
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Cancelled, Completed
    public string SpecialRequests { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public Payment? Payment { get; set; }
}

public class Payment
{
    public int Id { get; set; }
    public int BookingId { get; set; }
    public Booking Booking { get; set; } = null!;
    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty; // Card, Cash, Online
    public string Status { get; set; } = "Pending"; // Pending, Completed, Refunded
    public string TransactionId { get; set; } = string.Empty;
    public DateTime PaidAt { get; set; } = DateTime.UtcNow;
}
