using System;
using System.Collections.Generic;

namespace melee_notes.Models
{
    public partial class Set
    {
        public Set()
        {
            Games = new HashSet<Game>();
        }

        public long Id { get; set; }
        public long TournamentId { get; set; }
        public string BracketRound { get; set; }
        public string Format { get; set; }
        public string Outcome { get; set; }
        public string Type { get; set; }
        public string Notes { get; set; }
        public long PlayerId { get; set; }
        public long UserId { get; set; }

        public virtual Player Player { get; set; }
        public virtual Tournament Tournament { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<Game> Games { get; set; }
    }
}
