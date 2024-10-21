using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RacingAPI.DBContext;
using RacingAPI.Dtos;
using RacingAPI.Dtos.Driver;
using RacingAPI.Exceptions;
using RacingAPI.Helpers;
using RacingAPI.Models;

namespace RacingAPI.Controllers
{
    public class DriverController : BaseController
    {
        private readonly AppDBContext _context;
        public DriverController(AppDBContext context)
        {
            _context = context;
        }

        [HttpPost("Add")]
        [Consumes("multipart/form-data")]
        [Produces("application/json")]
        public ActionResult Add([FromForm] AddDriverDto driver)
        {
            return CreateHttpResponse(() =>
            {
                var driverToAdd = new Driver()
                {
                    Name = driver.Name,
                    Age = driver.Age,
                    Nationality = driver.Nationality,
                };
                if (driver.Image != null && driver.Image.Length > 0)
                {
                    var driverImagesFolder = Directory.GetCurrentDirectory() + "\\wwwroot\\DriverImages";
                    if (!Directory.Exists(driverImagesFolder))
                    {
                        Directory.CreateDirectory(driverImagesFolder);
                    }
                    // Combine the folder path and the file name to get the full path

                    driverToAdd.Image = Guid.NewGuid().ToString() + '_' + driver.Image.FileName;
                    string filePath = Path.Combine(driverImagesFolder, driverToAdd.Image);

                    // Copy the contents of the uploaded file to the destination file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        driver.Image.CopyTo(stream);
                    }
                }
                _context.Drivers.Add(driverToAdd);
                _context.SaveChanges();

                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Driver added successfully",
                    Result = true,
                    StatusCode = System.Net.HttpStatusCode.OK,
                    Success = true
                });

            });
        }

        [HttpPut("Update")]
        [Consumes("multipart/form-data")]
        [Produces("application/json")]
        public ActionResult Update([FromForm] UpdateDriverDto driver)
        {
            return CreateHttpResponse(() =>
            {
                var driverToUpdate = _context.Drivers.Where(c => c.ID == driver.ID).FirstOrDefault();
                if (driverToUpdate == null)
                {
                    throw new BadRequestException("Driver not found");
                }
                driverToUpdate.Name = driver.Name;
                driverToUpdate.Age = driver.Age;
                driverToUpdate.Nationality = driverToUpdate.Nationality;
                if (driver.Image != null && driver.Image.Length > 0)
                {
                    var driverImagesFolder = Directory.GetCurrentDirectory() + "\\wwwroot\\DriverImages";
                    if (!Directory.Exists(driverImagesFolder))
                    {
                        Directory.CreateDirectory(driverImagesFolder);
                    }
                    // Combine the folder path and the file name to get the full path

                    driverToUpdate.Image = Guid.NewGuid().ToString() + '_' + driver.Image.FileName;
                    string filePath = Path.Combine(driverImagesFolder, driverToUpdate.Image);

                    // Copy the contents of the uploaded file to the destination file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        driver.Image.CopyTo(stream);
                    }
                }
                _context.SaveChanges();

                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Driver updated successfully",
                    Result = true,
                    StatusCode = System.Net.HttpStatusCode.OK,
                    Success = true
                });

            });
        }


        [HttpGet("Get")]
        public ActionResult Get(string search)
        {
            return CreateHttpResponse(() =>
            {
                var drivers = _context.Drivers.Where(c => String.IsNullOrEmpty(search) || EF.Functions.Like(c.Name, $"%{search}%"))
                        .Select(c => new GetDriverDto
                        {
                            ID = c.ID,
                            Name = c.Name,
                            Age = c.Age,
                            Nationality = c.Nationality,
                            Image = c.Image
                        })
                        .ToList();

                drivers.ForEach(c =>
                {
                    if (!String.IsNullOrEmpty(c.Image))
                    {
                        c.Image = $"{Request.Scheme}://{Request.Host.Value}/driverimages/{c.Image}";
                    }
                });

                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Records fetched successfully",
                    Result = drivers,
                    StatusCode = System.Net.HttpStatusCode.OK,
                    Success = true
                });

            });
        }
        [HttpGet("GetDriversLookup")]
        public ActionResult GetDriversLookup(int? teamID)
        {
            return CreateHttpResponse(() =>
            {
                var drivers = _context.Drivers
                        .Where(c => (teamID.HasValue && c.FKTeamID == teamID) || !c.FKTeamID.HasValue)
                        .Select(c => new GetDriverDto
                        {
                            ID = c.ID,
                            Name = c.Name,
                            Age = c.Age,
                            Nationality = c.Nationality,
                            Image = c.Image
                        })
                        .ToList();

                drivers.ForEach(c =>
                {
                    if (!String.IsNullOrEmpty(c.Image))
                    {
                        c.Image = $"{Request.Scheme}://{Request.Host.Value}/driverimages/{c.Image}";
                    }
                });

                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Records fetched successfully",
                    Result = drivers,
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
                var driverToDelete = _context.Drivers.Where(c => c.ID == id).FirstOrDefault();
                if (driverToDelete == null)
                {
                    throw new BadRequestException("Driver not found");
                }
                _context.Drivers.Remove(driverToDelete);
                _context.SaveChanges();

                return new OkObjectResult(new SuccessResponseVM
                {
                    Message = "Driver deleted successfully",
                    Result = true,
                    StatusCode = System.Net.HttpStatusCode.OK,
                    Success = true
                });

            });
        }
    }
}
