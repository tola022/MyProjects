namespace RacingAPI.Dtos.Team
{
    public class GetTeamDto
    {
        public int ID { get; set; }
        public string Manufacturer { get; set; }
        public string Image { get; set; }
        public int? Driver1ID { get; set; }
        public string Driver1Name { get; set; }
        public int? Driver2ID { get; set; }
        public string Driver2Name { get; set; }
    }
}
