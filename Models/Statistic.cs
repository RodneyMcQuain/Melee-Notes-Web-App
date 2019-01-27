using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace melee_notes.Models
{
    public class Statistic
    {
        public string PlayerId { get; set; }
        public string MyCharacter { get; set; }
        public string OpponentCharacter { get; set; }
        public string Format { get; set; }
        public string Type { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public Statistic(string PlayerId, string MyCharacter, string OpponentCharacter, string Format, string Type, string StartDate, string EndDate)
        {
            this.PlayerId = PlayerId;
            this.MyCharacter = MyCharacter;
            this.OpponentCharacter = OpponentCharacter;
            this.Format = Format;
            this.Type = Type;
            this.StartDate = StartDate;
            this.EndDate = EndDate;
        }
    }
}
