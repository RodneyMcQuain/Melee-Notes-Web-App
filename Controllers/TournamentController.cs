using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using melee_notes.Models;
using Microsoft.AspNetCore.Authorization;

namespace melee_notes.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TournamentController : ControllerBase
    {
        private readonly MeleeNotesContext _context;

        public TournamentController(MeleeNotesContext context)
        {
            _context = context;
        }

        // GET: api/Tournament/User/5
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<Tournament>>> GetTournaments(long userId)
        {
            return await _context.Tournaments.Where(t => t.UserId == userId).ToListAsync();
        }

        // GET: api/Tournament/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tournament>> GetTournament(long id)
        {
            var tournament = await _context.Tournaments.Include(t => t.Sets).FirstOrDefaultAsync(t => t.Id == id);

            if (tournament == default(Tournament))
            {
                return NotFound();
            }

            return tournament;
        }

        // GET: api/Tournament/5/Set
        [HttpGet("{id}/Set")]
        public async Task<ActionResult<IEnumerable<Set>>> GetSetsFromTournament(long id)
        {
            var sets = await _context.Sets.Where(t => t.TournamentId == id).ToListAsync();

            return sets;
        }

        // PUT: api/Tournament/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTournament(long id, Tournament tournament)
        {
            if (id != tournament.Id)
            {
                return BadRequest();
            }

            _context.Entry(tournament).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TournamentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Tournament/User/5
        [HttpPost("User/{userId}")]
        public async Task<ActionResult<Tournament>> PostTournament(long userId, Tournament tournament)
        {
            tournament.UserId = userId;

            _context.Tournaments.Add(tournament);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTournament", new { id = tournament.Id }, tournament);
        }
    
        // DELETE: api/Tournament/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Tournament>> DeleteTournament(long id)
        {
            var tournament = await _context.Tournaments.Include(t => t.Sets).FirstOrDefaultAsync(t => t.Id == id);

            if (tournament == null)
            {
                return NotFound();
            }

            _context.Sets.RemoveRange(tournament.Sets);

            _context.Tournaments.Remove(tournament);
            await _context.SaveChangesAsync();

            return tournament;
        }

        private bool TournamentExists(long id)
        {
            return _context.Tournaments.Any(e => e.Id == id);
        }
    }
}
