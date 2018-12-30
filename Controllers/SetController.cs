using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using melee_notes.Models;
using Microsoft.AspNetCore.Authorization;

namespace melee_notes.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SetController : ControllerBase
    {
        private readonly MeleeNotesContext _context;

        public SetController(MeleeNotesContext context)
        {
            _context = context;
        }

        // GET: api/Set/User/5
        [HttpGet("User/{userId}")]
        public async Task<ActionResult<IEnumerable<Set>>> GetSets(long userId)
        {
            return await _context.Sets.Where(s => s.UserId == userId).ToListAsync();
        }

        // GET: api/Set/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Set>> GetSet(long id)
        {
            var @set = await _context.Sets.Include(s => s.Games).FirstOrDefaultAsync(s => s.Id == id);

            if (@set == null)
            {
                return NotFound();
            }

            return @set;
        }

        // PUT: api/Set/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSet(long id, Set @set)
        {
            if (id != @set.Id)
            {
                return BadRequest();
            }

            _context.Entry(@set).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SetExists(id))
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

        // POST: api/Set
        [HttpPost("User/{userId}")]
        public async Task<ActionResult<Set>> PostSet(long userId, Set @set)
        {
            @set.UserId = userId; 

            _context.Sets.Add(@set);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSet", new { id = @set.Id }, @set);
        }

        // DELETE: api/Set/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Set>> DeleteSet(long id)
        {
            var @set = await _context.Sets.FindAsync(id);
            if (@set == null)
            {
                return NotFound();
            }

            _context.Sets.Remove(@set);
            await _context.SaveChangesAsync();

            return @set;
        }

        private bool SetExists(long id)
        {
            return _context.Sets.Any(e => e.Id == id);
        }
    }
}
