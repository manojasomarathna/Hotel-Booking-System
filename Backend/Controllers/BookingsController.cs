using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HotelBooking.API.DTOs;
using HotelBooking.API.Services;

namespace HotelBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService) => _bookingService = bookingService;

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BookingCreateRequest request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var booking = await _bookingService.CreateBookingAsync(userId, request);

        if (booking == null)
            return BadRequest(new { message = "Room is not available for the selected dates." });

        return CreatedAtAction(nameof(GetById), new { id = booking.Id }, booking);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll() =>
        Ok(await _bookingService.GetAllBookingsAsync());

    [HttpGet("my")]
    public async Task<IActionResult> GetMyBookings()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return Ok(await _bookingService.GetUserBookingsAsync(userId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);
        return booking == null ? NotFound() : Ok(booking);
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] BookingStatusUpdate update)
    {
        var success = await _bookingService.UpdateStatusAsync(id, update.Status);
        return success ? Ok() : NotFound();
    }

    [HttpGet("dashboard")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetDashboard() =>
        Ok(await _bookingService.GetDashboardStatsAsync());
}
