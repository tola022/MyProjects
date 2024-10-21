using System.ComponentModel.DataAnnotations;

namespace RacingAPI.Models
{
    public class Race : BaseModel
    {
        public int ID { get; set; }
        [MaxLength(200)]
        public string WinnerName { get; set; }
        [MaxLength(200)]
        public string WinnerTime { get; set; }
        [MaxLength(200)]
        public string GrandPrix { get; set; }
        public int? NumberOfLaps { get; set; }
    }
}
