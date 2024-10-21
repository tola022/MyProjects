using System.ComponentModel.DataAnnotations;

namespace RacingAPI.Dtos.Driver
{
    public class AddDriverDto
    {
        public string Name { get; set; }
        public int? Age { get; set; }
        public string Nationality { get; set; }
        public IFormFile Image { get; set; }
    }
}
