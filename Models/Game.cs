using System;
using System.Collections.Generic;

namespace melee_notes.Models
{
    public partial class Game
    {
        public long Id { get; set; }
        public long SetId { get; set; }
        public string MyCharacter { get; set; }
        public string OpponentCharacter { get; set; }
        public string Stage { get; set; }
        public string Outcome { get; set; }
        public long UserId { get; set; }

        public virtual Set Set { get; set; }
        public virtual User User { get; set; }
    }
}
