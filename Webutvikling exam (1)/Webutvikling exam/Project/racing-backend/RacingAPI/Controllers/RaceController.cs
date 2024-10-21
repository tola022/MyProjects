using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RacingAPI.DBContext;
using RacingAPI.Dtos;
using RacingAPI.Dtos.Driver;
using RacingAPI.Dtos.Race;
using RacingAPI.Exceptions;
using RacingAPI.Helpers;
using RacingAPI.Models;

namespace RacingAPI.Controllers
{
    public class RaceController : BaseController
    {
        private readonly AppDBContext _context;
        public RaceController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("Add")]
        public ActionResult Add(AddRaceDto race)
        {
            return CreateHttpResponse(() =>
            {
                var raceToAdd = new Race()
                {
                    WinnerName = race.WinnerName,
                    WinnerTime = race.WinnerTime,
                    GrandPrix = race.GrandPrix,
                    NumberOfLaps = race.NumberOfLaps
                };
                _context.Races.Add(raceToAdd);
                _context.SaveChanges();

                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Race added successfully",
                    Result = true,
                    StatusCode = System.Net.HttpStatusCode.OK,
                    Success = true
                });

            });
        }

        [HttpPut("Update")]
        public ActionResult Update(UpdateRaceDto race)
        {
            return CreateHttpResponse(() =>
            {
                var raceToUpdate = _context.Races.Where(c => c.ID == race.ID).FirstOrDefault();
                if (raceToUpdate == null)
                {
                    throw new BadRequestException("Race not found");
                }
                raceToUpdate.WinnerName = race.WinnerName;
                raceToUpdate.WinnerTime = race.WinnerTime;
                raceToUpdate.NumberOfLaps = race.NumberOfLaps;
                raceToUpdate.GrandPrix = race.GrandPrix;
                _context.SaveChanges();

                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Race updated successfully",
                    Result = true,
                    StatusCode = System.Net.HttpStatusCode.OK,
                    Success = true
                });

            });
        }


        [HttpGet("Get")]
        public ActionResult Get()
        {
            return CreateHttpResponse(() =>
            {
                var races = _context.Races
                        .Select(c => new GetRaceDto
                        {
                            ID = c.ID,
                            GrandPrix = c.GrandPrix,
                            NumberOfLaps = c.NumberOfLaps,
                            WinnerTime = c.WinnerTime,
                            WinnerName = c.WinnerName
                        })
                        .ToList();


                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Records fetched successfully",
                    Result = races,
                    StatusCode = System.Net.HttpStatusCode.OK,
                    Success = true
                });

            });
        }


        [HttpDelete("Delete/{id:int}")]
        public ActionResult Delete(int id)
        {
            return CreateHttpResponse(() =>
            {
                var raceToDelete = _context.Races.Where(c => c.ID == id).FirstOrDefault();
                if (raceToDelete == null)
                {
                    throw new BadRequestException("Race not found");
                }
                _context.Races.Remove(raceToDelete);
                _context.SaveChanges();

                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Race deleted successfully",
                    Result = true,
                    StatusCode = System.Net.HttpStatusCode.OK,
                    Success = true
                });

            });
        }
    }
}
