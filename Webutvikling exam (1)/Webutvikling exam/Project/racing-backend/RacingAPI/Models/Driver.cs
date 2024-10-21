using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RacingAPI.Models
{
    public class Driver : BaseModel
    {
        public int ID { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        public int? Age { get; set; }
        [MaxLength(200)]
        public string Nationality { get; set; }
        [MaxLength(500)]
        public string Image { get; set; }
        public int? FKTeamID { get; set; }
        public virtual Team Team { get; set; }
    }
}
