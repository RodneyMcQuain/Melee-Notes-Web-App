using System;
using System.Collections.Generic;

namespace melee_notes.Models
{
    public partial class Player
    {
        public Player()
        {
            Sets = new HashSet<Set>();
        }

        public long Id { get; set; }
        public string Tag { get; set; }
        public string Notes { get; set; }
        public long UserId { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<Set> Sets { get; set; }
    }
}
