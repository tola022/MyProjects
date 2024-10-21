namespace RacingAPI.Dtos.Race
{
    public class UpdateRaceDto
    {
        public int ID { get; set; }
        public string WinnerName { get; set; }
        public string WinnerTime { get; set; }
        public string GrandPrix { get; set; }
        public int? NumberOfLaps { get; set; }
    }
}
