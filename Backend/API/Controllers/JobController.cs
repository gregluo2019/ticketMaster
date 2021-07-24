using Forum.Data;
using Forum.Data.Models;
using Forum.WebApi.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Forum.WebApi.Controllers
{
 

    public class UpdatePanelTimeInput
    {
        public int Id { get; set; }
    }
    public class AddJobUserInput
    {
        public int Id { get; set; }
        public string Action { get; set; }
    }

    public class JobsResult
    {
        public Job[] Data { get; set; }
        public int Count { get; set; }
    }


    [Route("api/[controller]/[action]")]
    public class JobController : BaseController
    {

        private readonly ForumContext _context;

        public JobController(ForumContext context, ILogger<BaseController> logger) : base(logger, null)
        {
            _context = context;

        }

        #region Panels

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Panel>> AddPanel(Panel model)
        {
            if (!this.User.IsInRole("Admin") && !this.User.IsInRole("Manager"))
            {
                return this.Unauthorized();
            }

            _context.Panels.Add(model);
            await _context.SaveChangesAsync();

            return model;
        }

        [Authorize]
        [HttpPut()]
        public async Task<ActionResult<Panel>> UpdatePanelTime(UpdatePanelTimeInput input)
        {
            try
            {
                if (!this.User.IsInRole("Normal"))
                {
                    return this.Unauthorized();
                }
                if (!this.User.IsInRole("Normal"))
                {
                    return this.Unauthorized();
                }
                if (this.User.FindFirst(ClaimTypes.Email) == null)
                {
                    return this.Unauthorized(new { Message = "Unauthorized" });
                }
                var email = this.User.FindFirst(ClaimTypes.Email).Value;
                var user = _context.Users.FirstOrDefault(u => u.Email == email);
                if (user == null)
                {
                    return this.Unauthorized(new { Message = "Unauthorized" });
                }

                var panel = await _context.Panels.FindAsync(input.Id);
                if (panel == null)
                {
                    return this.BadRequest(new { Message = "Cannot find this panel" });
                }
                panel.PackingStaffId = user.Id;
                panel.PackingTime = DateTime.UtcNow;
                _context.Entry(panel).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return panel;
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        [Authorize]
        [HttpPut()]
        public async Task<IActionResult> EditPanel(Panel model)
        {
            try
            {
                if (!this.User.IsInRole("Admin") && !this.User.IsInRole("Manager"))
                {
                    return this.Unauthorized();
                }

                _context.Entry(model).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<object> DeletePanel(int id)
        {
            try
            {
                if (!this.User.IsInRole("Admin") && !this.User.IsInRole("Manager"))
                {
                    return this.Unauthorized();
                }

                var panel = await _context.Panels.FindAsync(id);
                if (panel == null)
                {
                    return NotFound();
                }

                _context.Panels.Remove(panel);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception e)
            {
                return this.BadRequest(new ReturnMessage { Message = e.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<object> GetPanel(int id)
        {
            try
            {
                var panel = await _context.Panels.FirstOrDefaultAsync(j => j.Id == id);
                if (panel == null)
                {
                    return NotFound();
                }

                return panel;
            }
            catch (Exception e)
            {
                return this.BadRequest(new { Message = e.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet("{jobId}")]
        public async Task<object> GetPanelMore(int jobId)
        {
            try
            {
                var panels = await _context.Panels
                    .Include(p=>p.PackingStaff)
                    .Where(p => p.JobId == jobId)
                    .OrderBy(p => p.Id)
                    .ToListAsync(); ;

                return panels;
            }
            catch (Exception e)
            {
                return this.BadRequest(new { Message = e.Message });
            }
        }

        #endregion

        #region JobUser
        [Authorize]
        [HttpPut()]
        public async Task<ActionResult<JobOutput>> AddJobUser(AddJobUserInput input)
        {
            try
            {
                if (!this.User.IsInRole("Normal"))
                {
                    return this.Unauthorized();
                }
                if (this.User.FindFirst(ClaimTypes.Email) == null)
                {
                    return this.Unauthorized(new { Message = "Unauthorized" });
                }
                var email = this.User.FindFirst(ClaimTypes.Email).Value;
                var user = _context.Users.FirstOrDefault(u => u.Email == email);
                if (user == null)
                {
                    return this.Unauthorized(new { Message = "Unauthorized" });
                }

                if (input.Id == 1) // it is Check In/Out
                {
                    var minTime = DateTime.UtcNow.Date;
                    var maxTime = DateTime.UtcNow.Date.AddDays(1);
                    var action =  _context.JobUsers
                        .FirstOrDefault(p => p.JobId == 1 && p.UserId == user.Id && p.Action == input.Action && p.Time > minTime && p.Time < maxTime);

                    if (action != null)
                    {
                        _context.JobUsers.Remove(action);
                        await _context.SaveChangesAsync();
                    }
                }

                var jobUser = new JobUser();
                jobUser.JobId = input.Id;
                jobUser.UserId = user.Id;
                jobUser.Action = input.Action;
                jobUser.Time = DateTime.UtcNow;
                _context.JobUsers.Add(jobUser);
                await _context.SaveChangesAsync();

                var job = await _context.Jobs.FindAsync(input.Id);
                if (job == null)
                {
                    return NotFound();
                }
                return this.GetJobOutput(job);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        [AllowAnonymous]
        [HttpGet("{jobId}")]
        public async Task<object> GetJobUserActions(int jobId)
        {
            try
            {
                var actionsOfUser = await _context.JobUsers.Include(p => p.Job).Include(p => p.User)
                    .Where(p => p.JobId == jobId)
                    .OrderBy(p => p.Time).ToArrayAsync();

                if (actionsOfUser.Length == 0)
                {
                    return NoContent();

                }
                var jobUserActionList = new List<JobUserAction>();
                JobUserAction jobUserAction;
                foreach (var jobUser in actionsOfUser)
                {
                    jobUserAction = new JobUserAction();

                    jobUserAction.jobId = jobUser.Job.Id;
                    jobUserAction.jobNumber = jobUser.Job.JobNumber;
                    jobUserAction.userId = jobUser.UserId;
                    jobUserAction.userName = jobUser.User.UserName;

                    var theActionName = jobUser.Action.Split(" ")[0];
                    var theActionStatus = jobUser.Action.Split(" ")[1];
                    if (theActionStatus == "Start")
                    {
                        jobUserAction.Action = theActionName;
                        jobUserAction.Start = jobUser.Time;

                        jobUserActionList.Add(jobUserAction);
                    }
                    else if (theActionStatus == "End")
                    {
                        var actionWithoutEndTime = jobUserActionList.FirstOrDefault(ju => ju.End == null && ju.Action == theActionName && ju.jobId == jobUser.Job.Id && ju.userId == jobUser.UserId);
                        if (actionWithoutEndTime != null)
                        {
                            actionWithoutEndTime.End = jobUser.Time;
                        }
                        else
                        {
                            var lastAction = jobUserActionList.LastOrDefault(ju => ju.Action == theActionName && ju.jobId == jobUser.Job.Id && ju.userId == jobUser.UserId);
                            if (lastAction != null)
                                lastAction.End = jobUser.Time;
                        }
                    }
                }

                var minTime = actionsOfUser[0].Time?.Date;
                var maxTime = actionsOfUser[actionsOfUser.Length - 1].Time?.Date.AddDays(1);
                var allUserIds = jobUserActionList.Select(ju => ju.userId).Distinct().ToArray();

                var actionsOfUserForCheckInOut = await _context.JobUsers.Include(p => p.Job).Include(p => p.User)
                   .Where(p => p.JobId == 1 && p.Time > minTime && p.Time < maxTime && allUserIds.Contains(p.UserId))
                   .OrderBy(p => p.Time).ToArrayAsync();

                var jobUserActionListForCheckInOut = new List<JobUserAction>();

                foreach (var jobUser in actionsOfUserForCheckInOut)
                {
                    jobUserAction = new JobUserAction();

                    jobUserAction.jobId = jobUser.Job.Id;
                    jobUserAction.jobNumber = jobUser.Job.JobNumber;
                    jobUserAction.userId = jobUser.UserId;
                    jobUserAction.userName = jobUser.User.UserName;

                    var theActionName = jobUser.Action.Split(" ")[0];
                    var theActionStatus = jobUser.Action.Split(" ")[1];
                    if (theActionStatus == "In")
                    {
                        jobUserAction.Action = theActionName;

                        var firstTime = jobUser.Time;
                        var firstAction = jobUserActionList.Where(ju => ju.userId == jobUser.UserId && ju.Start?.Date == jobUser.Time?.Date).OrderBy(ju => ju.Start).FirstOrDefault();
                        if (firstAction != null)
                        {
                            var firstActionTime = firstAction.Start;
                            firstTime = jobUser.Time < firstActionTime ? jobUser.Time : firstActionTime;
                        }
                        jobUserAction.Start = firstTime;

                        jobUserActionListForCheckInOut.Add(jobUserAction);
                    }
                    else if (theActionStatus == "Out")
                    {
                        var lastTime = jobUser.Time;
                        var lastAction = jobUserActionList.Where(ju => ju.userId == jobUser.UserId && ju.End?.Date == jobUser.Time?.Date).OrderBy(ju => ju.End).LastOrDefault();
                        if (lastAction != null) {
                            var lastActionTime = lastAction.End;
                            lastTime = jobUser.Time > lastActionTime ? jobUser.Time : lastActionTime;
                        }

                        var actionWithoutEndTime = jobUserActionListForCheckInOut.FirstOrDefault(ju => ju.Start?.Date == jobUser.Time?.Date && ju.End == null && ju.Action == theActionName && ju.jobId == jobUser.Job.Id && ju.userId == jobUser.UserId);
                        if (actionWithoutEndTime != null)
                        {
                            actionWithoutEndTime.End = lastTime;
                        }
                    }
                }

                jobUserActionListForCheckInOut.AddRange(jobUserActionList);
                return jobUserActionListForCheckInOut;
            }
            catch (Exception e)
            {
                return this.BadRequest(new { Message = e.Message });
            }
        }

       
        #endregion

        #region Jobs
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Job>> AddJob(Job model)
        {
            if (!this.User.IsInRole("Admin") && !this.User.IsInRole("Manager"))
            {
                return this.Unauthorized();
            }

            _context.Jobs.Add(model);
            await _context.SaveChangesAsync();

            return model;
        }

        [Authorize]
        [HttpPut()]
        public async Task<IActionResult> EditJob(Job model)
        {
            try
            {
                _context.Entry(model).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<object> DeleteJob(int id)
        {
            try
            {
                if (!this.User.IsInRole("Admin") && !this.User.IsInRole("Manager"))
                {
                    return this.Unauthorized();
                }

                var job = await _context.Jobs.FindAsync(id);
                if (job == null)
                {
                    return NotFound();
                }

                _context.Jobs.Remove(job);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception e)
            {
                return this.BadRequest(new ReturnMessage { Message = e.Message });
            }
        }

        private JobOutput GetJobOutput(Job job)
        {
            var jobOutput = new JobOutput();
            jobOutput.Id = job.Id;
            jobOutput.JobNumber = job.JobNumber;
            jobOutput.Description = job.Description;
            if (this.User.IsInRole("Normal"))
            {
                if (this.User.FindFirst(ClaimTypes.Email) != null)
                {
                    var email = this.User.FindFirst(ClaimTypes.Email).Value;
                    var user = _context.Users.FirstOrDefault(u => u.Email == email);
                    if (user != null)
                    {
                        if (job.Id == 1) //special Job of "Check In/Out"
                        {
                            var checkIn = _context.JobUsers.Where(ju => ju.UserId == user.Id && ju.JobId == job.Id && ju.Action == "Check In").OrderByDescending(ju => ju.Time).FirstOrDefault();
                            if (checkIn != null)
                            {
                                DateTime checkInTimeUtc = (DateTime)checkIn.Time;
                                var checkInTimeLocal = checkInTimeUtc.ToLocalTime();
                                if (checkInTimeLocal.Date == DateTime.Now.ToLocalTime().Date)
                                {
                                    jobOutput.CheckIn = checkInTimeLocal;

                                    var checkOut = _context.JobUsers.Where(ju => ju.UserId == user.Id && ju.JobId == job.Id && ju.Action == "Check Out").OrderByDescending(ju => ju.Time).FirstOrDefault();
                                    if (checkOut != null)
                                    {
                                        DateTime checkOutTimeUtc = (DateTime)checkOut.Time;
                                        var checkOutTimeLocal = checkOutTimeUtc.ToLocalTime();
                                        if (checkOutTimeLocal.Date == DateTime.Now.ToLocalTime().Date)
                                        {
                                            jobOutput.CheckOut = checkOutTimeLocal;
                                        }
                                    }
                                }
                            }                            
                        }
                        else
                        {
                            var actionsOfUser = _context.JobUsers.Where(ju => ju.UserId == user.Id && ju.JobId == job.Id).OrderBy(ju => ju.Time).ToArray();
                            foreach (var jobUser in actionsOfUser)
                            {
                                switch (jobUser.Action)
                                {
                                    case "Cutting Start":
                                        jobOutput.CuttingStart = jobUser.Time;
                                        jobOutput.CuttingEnd = null;
                                        break;
                                    case "Cutting End":
                                        jobOutput.CuttingEnd = jobUser.Time;
                                        break;
                                    case "Sanding Start":
                                        jobOutput.SandingStart = jobUser.Time;
                                        jobOutput.SandingEnd = null;
                                        break;
                                    case "Sanding End":
                                        jobOutput.SandingEnd = jobUser.Time;
                                        break;
                                    case "BaseCoating Start":
                                        jobOutput.BaseCoatingStart = jobUser.Time;
                                        jobOutput.BaseCoatingEnd = null;
                                        break;
                                    case "BaseCoating End":
                                        jobOutput.BaseCoatingEnd = jobUser.Time;
                                        break;
                                    case "TopCoating Start":
                                        jobOutput.TopCoatingStart = jobUser.Time;
                                        jobOutput.TopCoatingEnd = null;
                                        break;
                                    case "TopCoating End":
                                        jobOutput.TopCoatingEnd = jobUser.Time;
                                        break;
                                    case "Packing Start":
                                        jobOutput.PackingStart = jobUser.Time;
                                        jobOutput.PackingEnd = null;
                                        break;
                                    case "Packing End":
                                        jobOutput.PackingEnd = jobUser.Time;
                                        break;
                                }
                            }
                        }
                    }
                }
            }
            return jobOutput;
        }

        [AllowAnonymous]
        [HttpGet("{jobNumber}")]
        public async Task<object> GetJob(string jobNumber)
        {
            try
            {
                var job = await _context.Jobs.FirstOrDefaultAsync(j => j.JobNumber == jobNumber);

                if (job == null)
                {
                    return NotFound();
                }            

                return this.GetJobOutput(job);
            }
            catch (Exception e)
            {
                return this.BadRequest(new { Message = e.Message });
            }
        }

        [Authorize]
        [HttpGet]
        public async Task<object> GetJobs([FromQuery] PaginationDataForJob data)
        {
            try
            {
                IQueryable<Job> query = _context.Jobs.Where(q => q.JobNumber != "1");

                if (!String.IsNullOrEmpty(data.Filter))
                {
                    query = query.Where(q => q.JobNumber.ToLower().Contains(data.Filter.ToLower())
                        || q.Description.ToLower().Contains(data.Filter.ToLower())
                        );
                }

                var countTask = await query.CountAsync();

                var resultsTask = query.OrderBy(q => q.JobNumber);
                if (data.SortDirection == "asc")
                {
                    switch (data.Sort)
                    {
                        case "jobNumber":
                            resultsTask = query.OrderBy(q => q.JobNumber);
                            break;
                        case "description":
                            resultsTask = query.OrderBy(q => q.Description);
                            break;
                    }
                }
                else if (data.SortDirection == "desc")
                {
                    switch (data.Sort)
                    {
                        case "jobNumber":
                            resultsTask = query.OrderByDescending(q => q.JobNumber);
                            break;
                        case "description":
                            resultsTask = query.OrderByDescending(q => q.Description);
                            break;
                    }
                }

                var resultsArray = resultsTask.Skip(data.PageSize * data.PageIndex).Take(data.PageSize).ToArrayAsync();

                return new JobsResult()
                {
                    Count = countTask,
                    Data = await resultsArray,
                };
            }
            catch (Exception e)
            {
                return this.BadRequest(new { Message = e.Message });
            }
        }

        #endregion

        #region File
        [Authorize]
        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> Upload()
        {
            try
            {
                if (!this.User.IsInRole("Admin") && !this.User.IsInRole("Manager")) { return this.Unauthorized(); }

                var formCollection = await Request.ReadFormAsync();

                var folderName = "wwwroot\\assets\\resources";
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName, DateTime.Now.Year + "-" + DateTime.Now.Month);
                var result = "";
                foreach (var file in formCollection.Files)
                {
                    if (file.Length == 0) { continue; }
                    var fileName = file.Name;
                    bool exists = Directory.Exists(pathToSave);
                    if (!exists) { Directory.CreateDirectory(pathToSave); }

                    var fullPath = Path.Combine(pathToSave, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                        var job = this.CreateNewJobAndDeleteOldJob(fileName);

                        stream.Position = 0;
                        string fileExtension = Path.GetExtension(fileName).ToLower();
                        ISheet sheet;
                        if (fileExtension == ".xls")
                        {
                            HSSFWorkbook hssfwb = new HSSFWorkbook(stream); //This will read the Excel 97-2000 formats  
                            for (int i = 1; i < hssfwb.NumberOfSheets; i++) //Read Sheet of the File
                            {
                                sheet = hssfwb.GetSheetAt(i);
                                if( !this.ReadSheet(sheet, job.Id))
                                {
                                    result += "The format of sheet" + i + " is wrong. The header row should be 'Panel;Irr.;CUT;Qty.;Length;Width;Depth;Panel;Total Panel;Colour";
                                }
                            }
                        }
                        else
                        {
                            XSSFWorkbook hssfwb = new XSSFWorkbook(stream); //This will read 2007 Excel format  
                            for (int i = 1; i < hssfwb.NumberOfSheets; i++) //Read Sheet of the File
                            {
                                sheet = hssfwb.GetSheetAt(i);
                                if (!this.ReadSheet(sheet, job.Id))
                                {
                                    result += "The format of sheet" + i + " is wrong. The header row should be 'Panel;Irr.;CUT;Qty.;Length;Width;Depth;Panel;Total Panel;Colour";
                                }
                            }
                        }
                    }
                }
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        private bool ReadSheet(ISheet sheet, int jobId)
        {
            var headerRow = sheet.GetRow(0); //Get Header Row
            if (this.IsWrongFormat(headerRow)) { return false; }

            for (int i = (sheet.FirstRowNum + 3); i <= sheet.LastRowNum; i++) //Read Excel File
            {
                var row = sheet.GetRow(i);
                var panelId = row.GetCell(0).ToString();
                if (string.IsNullOrEmpty(panelId)) { continue; }
                if (panelId.ToLower() == "date" || panelId.ToLower() == "sign") { break; }

                this.InsertPanel(row, jobId);
            }
            return true;
        }

        private Job CreateNewJobAndDeleteOldJob(string fileName)
        {
            var job = new Job();
            var fileNameArray = Path.GetFileNameWithoutExtension(fileName).Split(" - ");
            job.JobNumber = fileNameArray[0];
            if (fileNameArray.Length > 1)
            {
                job.Description = string.Join(" - ", fileNameArray.Skip(1).ToArray());
            }

            var oldJob = _context.Jobs.FirstOrDefault(j => j.JobNumber == job.JobNumber);
            if (oldJob != null)
            {
                _context.Jobs.Remove(oldJob);
                _context.SaveChanges();
            }

            _context.Jobs.Add(job);
            _context.SaveChanges();
            return job;
        }

        private void InsertPanel(IRow row, int jobId)
        {
            Panel panel = new Panel();
            try
            {
                panel.JobId = jobId;
                panel.PanelId = row.GetCell(0).ToString();

                if (Int32.TryParse(row.GetCell(3).ToString(), out int qty))
                {
                    panel.Qty = qty;
                }
                if (Int32.TryParse(row.GetCell(4).ToString(), out int length))
                {
                    panel.Length = length;
                }
                if (Int32.TryParse(row.GetCell(5).ToString(), out int width))
                {
                    panel.Width = width;
                }
                if (Int32.TryParse(row.GetCell(6).ToString(), out int depth))
                {
                    panel.Depth = depth;
                }

                panel.Area = (float)panel.Length * panel.Width / 1000000;
                panel.Area = (float)Math.Round(panel.Area * 100f) / 100f;
                panel.TotalArea = (float)panel.Qty * panel.Length * panel.Width / 1000000;
                panel.TotalArea = (float)Math.Round(panel.TotalArea * 100f) / 100f;

                panel.Color = row.GetCell(9).ToString();
                panel.ColorType = row.GetCell(10).ToString();

                _context.Panels.Add(panel);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                var logInfo = "Cannot insert panel: " + panel.ToString() + ". Exception: " + ex.ToString();
                this.Logger.LogInformation(logInfo);
            }
        }
        private bool IsWrongFormat(IRow headerRow)
        {
            int cellCount = headerRow.LastCellNum;
            if (cellCount < 11)
            {
                return true;
            }
            //;Irr.;CUT;Qty.;Length;Width;Depth;Panel;Total Panel;Colour
            if (!headerRow.GetCell(0).ToString().ToLower().Contains("panel"))
            {
                return true;
            }
            if (!headerRow.GetCell(3).ToString().ToLower().Contains("qty"))
            {
                return true;
            }
            if (!headerRow.GetCell(4).ToString().ToLower().Contains("length"))
            {
                return true;
            }
            if (!headerRow.GetCell(5).ToString().ToLower().Contains("width"))
            {
                return true;
            }
            if (!headerRow.GetCell(6).ToString().ToLower().Contains("depth"))
            {
                return true;
            }
            if (!headerRow.GetCell(9).ToString().ToLower().Contains("colour"))
            {
                return true;
            }

            return false;
        }
        #endregion
    }
}
