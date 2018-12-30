using System;
using System.Collections.Generic;

namespace melee_notes.Models
{
    public partial class User
    {
        public User()
        {
            Games = new HashSet<Game>();
            Players = new HashSet<Player>();
            Sets = new HashSet<Set>();
            Tournaments = new HashSet<Tournament>();
        }

        public long Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public DateTime DateCreated { get; set; }
        public string Password { get; set; }

        public virtual ICollection<Game> Games { get; set; }
        public virtual ICollection<Player> Players { get; set; }
        public virtual ICollection<Set> Sets { get; set; }
        public virtual ICollection<Tournament> Tournaments { get; set; }
    }
}
