using Microsoft.EntityFrameworkCore;
using HotelBooking.API.Models;

namespace HotelBooking.API.Data;

public class HotelDbContext : DbContext
{
    public HotelDbContext(DbContextOptions<HotelDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Amenity> Amenities => Set<Amenity>();
    public DbSet<RoomAmenity> RoomAmenities => Set<RoomAmenity>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Composite key for junction table
        modelBuilder.Entity<RoomAmenity>()
            .HasKey(ra => new { ra.RoomId, ra.AmenityId });

        // Decimal precision
        modelBuilder.Entity<Room>()
            .Property(r => r.PricePerNight)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Booking>()
            .Property(b => b.TotalAmount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasColumnType("decimal(18,2)");

        // Indexes
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<Room>()
            .HasIndex(r => r.RoomNumber)
            .IsUnique();

        // Seed Amenities
        modelBuilder.Entity<Amenity>().HasData(
            new Amenity { Id = 1, Name = "Free WiFi", Icon = "wifi" },
            new Amenity { Id = 2, Name = "Air Conditioning", Icon = "wind" },
            new Amenity { Id = 3, Name = "Swimming Pool", Icon = "waves" },
            new Amenity { Id = 4, Name = "Breakfast Included", Icon = "coffee" },
            new Amenity { Id = 5, Name = "Mini Bar", Icon = "glass-water" },
            new Amenity { Id = 6, Name = "Ocean View", Icon = "binoculars" },
            new Amenity { Id = 7, Name = "Room Service", Icon = "bell-concierge" },
            new Amenity { Id = 8, Name = "Gym Access", Icon = "dumbbell" }
        );

        // Seed Rooms
        modelBuilder.Entity<Room>().HasData(
            new Room { Id = 1, RoomNumber = "101", RoomType = "Single", Description = "Cozy single room with garden view. Perfect for solo travelers.", PricePerNight = 75, MaxOccupancy = 1, ImageUrl = "/images/single.jpg", IsAvailable = true },
            new Room { Id = 2, RoomNumber = "201", RoomType = "Double", Description = "Spacious double room with city view. Ideal for couples.", PricePerNight = 120, MaxOccupancy = 2, ImageUrl = "/images/double.jpg", IsAvailable = true },
            new Room { Id = 3, RoomNumber = "301", RoomType = "Deluxe", Description = "Premium deluxe room with balcony and mountain view.", PricePerNight = 180, MaxOccupancy = 3, ImageUrl = "/images/deluxe.jpg", IsAvailable = true },
            new Room { Id = 4, RoomNumber = "401", RoomType = "Suite", Description = "Luxurious suite with panoramic ocean view and private jacuzzi.", PricePerNight = 350, MaxOccupancy = 4, ImageUrl = "/images/suite.jpg", IsAvailable = true },
            new Room { Id = 5, RoomNumber = "102", RoomType = "Single", Description = "Budget-friendly single room with all essentials.", PricePerNight = 65, MaxOccupancy = 1, ImageUrl = "/images/single.jpg", IsAvailable = true },
            new Room { Id = 6, RoomNumber = "202", RoomType = "Double", Description = "Elegant double room with king-size bed.", PricePerNight = 140, MaxOccupancy = 2, ImageUrl = "/images/double.jpg", IsAvailable = true }
        );

        // Seed Admin User (Password: Admin@123)
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                FullName = "Admin User",
                Email = "admin@hotel.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = "Admin",
                Phone = "+94771234567",
                CreatedAt = new DateTime(2024, 1, 1)
            }
        );

        // Room-Amenity seed
        modelBuilder.Entity<RoomAmenity>().HasData(
            new RoomAmenity { RoomId = 1, AmenityId = 1 },
            new RoomAmenity { RoomId = 1, AmenityId = 2 },
            new RoomAmenity { RoomId = 2, AmenityId = 1 },
            new RoomAmenity { RoomId = 2, AmenityId = 2 },
            new RoomAmenity { RoomId = 2, AmenityId = 4 },
            new RoomAmenity { RoomId = 3, AmenityId = 1 },
            new RoomAmenity { RoomId = 3, AmenityId = 2 },
            new RoomAmenity { RoomId = 3, AmenityId = 4 },
            new RoomAmenity { RoomId = 3, AmenityId = 5 },
            new RoomAmenity { RoomId = 4, AmenityId = 1 },
            new RoomAmenity { RoomId = 4, AmenityId = 2 },
            new RoomAmenity { RoomId = 4, AmenityId = 3 },
            new RoomAmenity { RoomId = 4, AmenityId = 4 },
            new RoomAmenity { RoomId = 4, AmenityId = 5 },
            new RoomAmenity { RoomId = 4, AmenityId = 6 },
            new RoomAmenity { RoomId = 4, AmenityId = 7 },
            new RoomAmenity { RoomId = 6, AmenityId = 1 },
            new RoomAmenity { RoomId = 6, AmenityId = 2 },
            new RoomAmenity { RoomId = 6, AmenityId = 7 }
        );
    }
}
