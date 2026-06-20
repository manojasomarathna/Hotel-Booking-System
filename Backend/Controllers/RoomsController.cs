using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HotelBooking.API.DTOs;
using HotelBooking.API.Services;

namespace HotelBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _roomService;

    public RoomsController(IRoomService roomService) => _roomService = roomService;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _roomService.GetAllRoomsAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var room = await _roomService.GetRoomByIdAsync(id);
        return room == null ? NotFound() : Ok(room);
    }

    [HttpPost("search")]
    public async Task<IActionResult> SearchAvailable([FromBody] RoomAvailabilityRequest request) =>
        Ok(await _roomService.GetAvailableRoomsAsync(request));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] RoomCreateRequest request)
    {
        var room = await _roomService.CreateRoomAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = room.Id }, room);
    }

    [HttpPatch("{id}/availability")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAvailability(int id, [FromBody] bool isAvailable)
    {
        var success = await _roomService.UpdateRoomAvailabilityAsync(id, isAvailable);
        return success ? Ok() : NotFound();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _roomService.DeleteRoomAsync(id);
        return success ? Ok() : NotFound();
    }
}
