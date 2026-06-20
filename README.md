# 🏨 LuxeStay — Hotel Booking System

Full-stack hotel booking system built with **C# ASP.NET Core Web API** + **React** + **SQL Server (EF Core)**.

---

## 📁 Project Structure

```
HotelBooking/
├── Backend/                    # ASP.NET Core Web API (.NET 8)
│   ├── Controllers/            # API Endpoints
│   │   ├── AuthController.cs   # Register / Login
│   │   ├── RoomsController.cs  # CRUD + Search
│   │   └── BookingsController.cs # Booking + Admin
│   ├── Models/                 # Domain models (EF Entities)
│   │   └── Models.cs           # User, Room, Amenity, Booking, Payment
│   ├── Data/
│   │   └── HotelDbContext.cs   # EF Core DbContext + Seed Data
│   ├── DTOs/
│   │   └── DTOs.cs             # Request/Response records
│   ├── Services/
│   │   ├── AuthService.cs      # JWT + BCrypt
│   │   ├── RoomService.cs      # Room availability logic
│   │   └── BookingService.cs   # Booking + Dashboard stats
│   ├── Program.cs              # App configuration + DI
│   └── appsettings.json        # Connection string + JWT config
│
└── Frontend/                   # React + Vite + Tailwind CSS
    └── src/
        ├── api/index.js        # Axios client + API calls
        ├── context/AuthContext.jsx  # Global auth state
        ├── components/
        │   ├── Navbar.jsx
        │   └── RoomCard.jsx
        └── pages/
            ├── HomePage.jsx        # Landing + search
            ├── RoomsPage.jsx       # Room listing + filter
            ├── RoomDetailPage.jsx  # Room detail + booking form
            ├── AuthPages.jsx       # Login + Register
            ├── MyBookingsPage.jsx  # Guest bookings
            └── AdminDashboard.jsx  # Admin panel
```

---

## ⚙️ Backend Setup

### 1. Prerequisites
- .NET 8 SDK
- SQL Server (LocalDB or full)

### 2. Update connection string
Edit `Backend/appsettings.json`:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=HotelBookingDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

### 3. Run migrations & start
```bash
cd Backend
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

API runs at: `https://localhost:5000`  
Swagger UI: `https://localhost:5000/swagger`

---

## ⚛️ Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`

---

## 🔑 Default Admin Credentials
```
Email:    admin@hotel.com
Password: Admin@123
```

---

## 🛣️ API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |

### Rooms
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/rooms` | Public |
| GET | `/api/rooms/{id}` | Public |
| POST | `/api/rooms/search` | Public |
| POST | `/api/rooms` | Admin |
| DELETE | `/api/rooms/{id}` | Admin |

### Bookings
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/bookings` | Authenticated |
| GET | `/api/bookings/my` | Authenticated |
| GET | `/api/bookings` | Admin |
| PATCH | `/api/bookings/{id}/status` | Admin |
| GET | `/api/bookings/dashboard` | Admin |

---

## 🗄️ Database Schema

```
Users           → Id, FullName, Email, PasswordHash, Role, Phone
Rooms           → Id, RoomNumber, RoomType, Description, PricePerNight, MaxOccupancy
Amenities       → Id, Name, Icon
RoomAmenities   → RoomId (FK), AmenityId (FK)   [Junction table]
Bookings        → Id, UserId (FK), RoomId (FK), CheckIn, CheckOut, TotalAmount, Status
Payments        → Id, BookingId (FK), Amount, Method, Status
```

---

## ✨ Features

### Guest
- Browse all rooms with amenities and pricing
- Search available rooms by date and guest count
- Filter rooms by type (Single / Double / Deluxe / Suite)
- Book rooms with special requests
- View and cancel own bookings

### Admin
- Dashboard with stats (revenue, occupancy, check-ins)
- Manage all bookings (Confirm / Cancel / Complete)
- View booking history with guest details

### Security
- JWT Bearer Authentication
- BCrypt password hashing
- Role-based authorization (Guest / Admin)
- CORS configured for React dev server
