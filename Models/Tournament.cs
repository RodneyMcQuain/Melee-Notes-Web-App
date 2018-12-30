using System;
using System.Collections.Generic;

namespace melee_notes.Models
{
    public partial class Tournament
    {
        public Tournament()
        {
            Sets = new HashSet<Set>();
        }

        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
        public int? MyPlacing { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Notes { get; set; }
        public long? UserId { get; set; }

        public virtual User User { get; set; }
        public virtual ICollection<Set> Sets { get; set; }
    }
}
