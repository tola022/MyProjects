using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RacingAPI.DBContext;
using RacingAPI.Dtos.Driver;
using RacingAPI.Dtos.Team;
using RacingAPI.Exceptions;
using RacingAPI.Helpers;
using RacingAPI.Models;
using System.Data;

namespace RacingAPI.Controllers
{
    public class TeamController : BaseController
    {
        private readonly AppDBContext _context;
        public TeamController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("Add")]
        [Consumes("multipart/form-data")]
        [Produces("application/json")]
        public ActionResult Add([FromForm] AddTeamDto team)
        {
            return CreateHttpResponse(() =>
            {
                var teamToAdd = new Team()
                {
                    Manufacturer = team.Manufacturer
                };
                if (team.Driver1ID.HasValue)
                {
                    var driver1 = _context.Drivers.Where(c => c.ID == team.Driver1ID).FirstOrDefault();
                    if (driver1 == null)
                    {
                        throw new BadRequestException("Driver1 not found");
                    }
                    if (driver1.FKTeamID.HasValue)
                    {
                        throw new BadRequestException("Driver1 is already a part of a team");
                    }
                    teamToAdd.Drivers.Add(driver1);
                }
                if (team.Driver2ID.HasValue)
                {
                    var driver2 = _context.Drivers.Where(c => c.ID == team.Driver2ID).FirstOrDefault();
                    if (driver2 == null)
                    {
                        throw new BadRequestException("Driver2 not found");
                    }
                    if (driver2.FKTeamID.HasValue)
                    {
                        throw new BadRequestException("Driver2 is already a part of a team");
                    }
                    teamToAdd.Drivers.Add(driver2);
                }

                if (team.Image != null && team.Image.Length > 0)
                {
                    var teamImagesFolder = Directory.GetCurrentDirectory() + "\\wwwroot\\TeamImages";
                    if (!Directory.Exists(teamImagesFolder))
                    {
                        Directory.CreateDirectory(teamImagesFolder);
                    }
                    // Combine the folder path and the file name to get the full path

                    teamToAdd.Image = Guid.NewGuid().ToString() + '_' + team.Image.FileName;
                    string filePath = Path.Combine(teamImagesFolder, teamToAdd.Image);

                    // Copy the contents of the uploaded file to the destination file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        team.Image.CopyTo(stream);
                    }
                }
                _context.Teams.Add(teamToAdd);
                _context.SaveChanges();

                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Team added successfully",
                    Result = true,
                    StatusCode = System.Net.HttpStatusCode.OK,
                    Success = true
                });

            });
        }

        [HttpPut("Update")]
        [Consumes("multipart/form-data")]
        [Produces("application/json")]
        public ActionResult Update([FromForm] UpdateTeamDto team)
        {
            return CreateHttpResponse(() =>
            {
                var teamToUpdate = _context.Teams.Include(c => c.Drivers).Where(c => c.ID == team.ID).FirstOrDefault();
                if (teamToUpdate == null)
                {
                    throw new BadRequestException("Team not found");
                }
                teamToUpdate.Manufacturer = teamToUpdate.Manufacturer;
                teamToUpdate.Drivers.RemoveWhere(c => c.ID != team.Driver1ID && c.ID != team.Driver2ID);
                if (team.Driver1ID.HasValue && !teamToUpdate.Drivers.Any(c => c.ID == team.Driver1ID.Value))
                {
                    var driver1 = _context.Drivers.Where(c => c.ID == team.Driver1ID).FirstOrDefault();
                    if (driver1 == null)
                    {
                        throw new BadRequestException("Driver1 not found");
                    }
                    if (driver1.FKTeamID.HasValue)
                    {
                        throw new BadRequestException("Driver1 is already a part of a team");
                    }
                    teamToUpdate.Drivers.Add(driver1);
                }
                if (team.Driver2ID.HasValue && !teamToUpdate.Drivers.Any(c => c.ID == team.Driver2ID.Value))
                {
                    var driver2 = _context.Drivers.Where(c => c.ID == team.Driver2ID).FirstOrDefault();
                    if (driver2 == null)
                    {
                        throw new BadRequestException("Driver2 not found");
                    }
                    if (driver2.FKTeamID.HasValue)
                    {
                        throw new BadRequestException("Driver2 is already a part of a team");
                    }
                    teamToUpdate.Drivers.Add(driver2);
                }


                if (team.Image != null && team.Image.Length > 0)
                {
                    var teamImagesFolder = Directory.GetCurrentDirectory() + "\\wwwroot\\TeamImages";
                    if (!Directory.Exists(teamImagesFolder))
                    {
                        Directory.CreateDirectory(teamImagesFolder);
                    }
                    // Combine the folder path and the file name to get the full path

                    teamToUpdate.Image = Guid.NewGuid().ToString() + '_' + team.Image.FileName;
                    string filePath = Path.Combine(teamImagesFolder, teamToUpdate.Image);

                    // Copy the contents of the uploaded file to the destination file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        team.Image.CopyTo(stream);
                    }
                }
                _context.SaveChanges();

                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Team updated successfully",
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
                var teams = _context.Teams.Include(c => c.Drivers).ToList();
                teams.ForEach(c =>
                {
                    if (!String.IsNullOrEmpty(c.Image))
                    {
                        c.Image = $"{Request.Scheme}://{Request.Host.Value}/teamimages/{c.Image}";
                    }
                });
                var teamsDto = new List<GetTeamDto>();
                teams.ForEach(c =>
                {
                    var teamDto = new GetTeamDto()
                    {
                        ID = c.ID,
                        Manufacturer = c.Manufacturer,
                        Image = c.Image
                    };
                    // max two drivers for one team
                    for (int i = 0; i < c.Drivers.Count && i < 2; i++)
                    {
                        if (i == 0)
                        {
                            teamDto.Driver1ID = c.Drivers.ElementAt(i).ID;
                            teamDto.Driver1Name = c.Drivers.ElementAt(i).Name;
                        }
                        if (i == 1)
                        {
                            teamDto.Driver2ID = c.Drivers.ElementAt(i).ID;
                            teamDto.Driver2Name = c.Drivers.ElementAt(i).Name;
                        }
                    }
                    teamsDto.Add(teamDto);
                });

                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Records fetched successfully",
                    Result = teamsDto,
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
                var teamToDelete = _context.Teams.Include(c => c.Drivers).Where(c => c.ID == id).FirstOrDefault();
                if (teamToDelete == null)
                {
                    throw new BadRequestException("Driver not found");
                }
                teamToDelete.Drivers.Clear();
                _context.Teams.Remove(teamToDelete);
                _context.SaveChanges();

                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Team deleted successfully",
                    Result = true,
                    StatusCode = System.Net.HttpStatusCode.OK,
                    Success = true
                });

            });
        }
    }
}
