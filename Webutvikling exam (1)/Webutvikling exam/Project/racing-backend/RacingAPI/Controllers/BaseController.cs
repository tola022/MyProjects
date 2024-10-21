using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RacingAPI.Exceptions;
using RacingAPI.Helpers;
using System.Net;

namespace RacingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {

        protected ObjectResult CreateHttpResponse(Func<ObjectResult> function)
        {
            ObjectResult response = null;
            try
            {
                if (ModelState.IsValid)
                    response = function.Invoke();
                else
                    response = new BadRequestObjectResult(new SuccessResponseVM
                    {
                        Message = "Validation Errors",
                        Result = ModelState.Values.SelectMany(values =>
                            values.Errors.Select(error => error.ErrorMessage)),
                        StatusCode = HttpStatusCode.BadRequest,
                        Success = false
                    });
            }
            catch (BadRequestException ex)
            {
                response = new BadRequestObjectResult(new SuccessResponseVM
                {
                    Message = ex.InnerException?.Message ?? ex.Message,
                    Result = "",
                    StatusCode = HttpStatusCode.BadRequest,
                    Success = false
                });
            }

            catch (DbUpdateException dbEx)
            {
                response = new InternalServerErrorObjectResult(new SuccessResponseVM
                {
                    Message = dbEx.InnerException?.Message ?? dbEx.Message,
                    Result = dbEx.StackTrace,
                    StatusCode = HttpStatusCode.InternalServerError,
                    Success = false
                });
            }
            catch (Exception ex)
            {
                response = new InternalServerErrorObjectResult(new SuccessResponseVM
                {
                    Message = ex.InnerException?.Message ?? ex.Message,
                    Result = ex.StackTrace,
                    StatusCode = HttpStatusCode.InternalServerError,
                    Success = false
                });
            }

            return response;
        }
    }
}
