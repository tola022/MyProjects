using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RacingAPI.Models
{
    public class Team : BaseModel
    {
        public Team()
        {
            Drivers = new HashSet<Driver>();
        }
        public int ID { get; set; }
        [Required]
        [MaxLength(500)]
        public string Manufacturer { get; set; }
        [MaxLength(500)]
        public string Image { get; set; }
        public virtual HashSet<Driver> Drivers { get; set; }
    }
}
