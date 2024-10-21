namespace RacingAPI.Dtos.Team
{
    public class AddTeamDto
    {
        public string Manufacturer { get; set; }
        public IFormFile Image { get; set; }
        public int? Driver1ID { get; set; }
        public int? Driver2ID { get; set; }
    }
}
