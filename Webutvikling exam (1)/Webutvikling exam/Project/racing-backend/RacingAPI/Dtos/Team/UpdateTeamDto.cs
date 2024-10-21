namespace RacingAPI.Dtos.Team
{
    public class UpdateTeamDto
    {
        public int ID { get; set; }
        public string Manufacturer { get; set; }
        public IFormFile Image { get; set; }
        public int? Driver1ID { get; set; }
        public int? Driver2ID { get; set; }
    }
}
