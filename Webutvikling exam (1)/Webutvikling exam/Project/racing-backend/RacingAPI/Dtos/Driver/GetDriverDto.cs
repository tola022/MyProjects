using System.ComponentModel.DataAnnotations;

namespace RacingAPI.Dtos.Driver
{
    public class GetDriverDto
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int? Age { get; set; }
        public string Nationality { get; set; }
        public string Image { get; set; }

    }
}
