using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using System.Net.Http;
using System.Web;
using AutoMapper;
using Forum.WebApi.Utils;

namespace Forum.WebApi.Controllers
{
    public class PaginationDataOfEvent
    {
        public string Sort { get; set; }
        public string SortDirection { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int? Id { get; set; }
        public string Type { get; set; }
        public string Name { get; set; }
        public string Keyword { get; set; }
        public string StartDateTime { get; set; }
        public string EndDateTime { get; set; }
        public string VenueId { get; set; }
        public string ClassificationId { get; set; }
    }

    public class VenueInput
    {
        public string Keyword { get; set; }
    }

    [AllowAnonymous]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        public EventController() 
        {
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<object> GetEvent(string id)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.TryAddWithoutValidation("accept", "application/json");

                    var builder = new UriBuilder("https://app.ticketmaster.com/discovery/v2/events/"+id);
                    builder.Port = -1;
                    var query = HttpUtility.ParseQueryString(builder.Query);
                    query["apikey"] = "zhqQUwQFVgosQTJL3yBNUkObDZiEfsTs";
                    builder.Query = query.ToString();
                    string url = builder.ToString();

                    using (var response = await client.GetAsync(url))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = await response.Content.ReadAsStringAsync();
                            return responseData;
                        }
                        else
                        {
                            return this.BadRequest(new ReturnMessage { Message = response.StatusCode.ToString() });
                        }
                    }
                }
            }
            catch (Exception e)
            {
                return this.BadRequest(new { Message = e.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<object> GetEvents([FromQuery] PaginationDataOfEvent data)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.TryAddWithoutValidation("accept", "application/json");

                    var builder = new UriBuilder("https://app.ticketmaster.com/discovery/v2/events.json");
                    builder.Port = -1;
                    var query = HttpUtility.ParseQueryString(builder.Query);
                    query["apikey"] = "zhqQUwQFVgosQTJL3yBNUkObDZiEfsTs";
                    query["size"] =data.PageSize.ToString();
                    query["page"] = data.PageIndex.ToString();

                    if (!string.IsNullOrEmpty(data.Keyword))
                    {
                        query["keyword"] = data.Keyword;
                    }
                    if (!string.IsNullOrEmpty(data.VenueId))
                    {
                        query["venueId"] = data.VenueId;
                    }
                    if (!string.IsNullOrEmpty(data.ClassificationId))
                    {
                        query["classificationId"] = data.ClassificationId;
                    }                    

                    if (!string.IsNullOrEmpty(data.Sort))
                    {
                        switch (data.Sort)
                        {
                            case "name":
                                query["sort"] = "name,";
                                break;
                            case "startTime":
                                query["sort"] = "date,";
                                break;
                        }

                        if (data.SortDirection == "asc")
                        {
                            query["sort"] += "asc";
                        }
                        else
                        {
                            query["sort"] += "desc";
                        }
                    }

                    builder.Query = query.ToString();
                    string url = builder.ToString();

                    if (!string.IsNullOrEmpty(data.StartDateTime))
                    {
                        url += "&startDateTime=" + data.StartDateTime;
                    }
                    if (!string.IsNullOrEmpty(data.EndDateTime))
                    {
                        url +="&endDateTime="+ data.EndDateTime;
                    }

                    Console.Write(url);
                    using (var response = await client.GetAsync(url))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = await response.Content.ReadAsStringAsync();
                            return responseData;
                        }
                        else
                        {
                            return this.BadRequest(response);
                        }

                    }
                }
            }
            catch (Exception e)
            {
                return this.BadRequest(new { Message = e.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<object> GetVenues([FromQuery] VenueInput data)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.TryAddWithoutValidation("accept", "application/json");

                    var builder = new UriBuilder("https://app.ticketmaster.com/discovery/v2/venues.json");
                    builder.Port = -1;
                    var query = HttpUtility.ParseQueryString(builder.Query);
                    query["apikey"] = "zhqQUwQFVgosQTJL3yBNUkObDZiEfsTs";
                    if (!string.IsNullOrEmpty(data.Keyword))
                    {
                        query["keyword"] = data.Keyword;
                    }
                    query["size"] = "200";
                    query["page"] = "0";

                    builder.Query = query.ToString();
                    string url = builder.ToString();

                    using (var response = await client.GetAsync(url))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = await response.Content.ReadAsStringAsync();
                            return responseData;
                        }
                        else
                        {
                            return this.BadRequest(new ReturnMessage { Message = response.StatusCode.ToString() });
                        }

                    }
                }
            }
            catch (Exception e)
            {
                return this.BadRequest(new { Message = e.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<object> GetClassifications()
        {
            try
            {
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.TryAddWithoutValidation("accept", "application/json");

                    var builder = new UriBuilder("https://app.ticketmaster.com/discovery/v2/classifications.json");
                    builder.Port = -1;
                    var query = HttpUtility.ParseQueryString(builder.Query);
                    query["apikey"] = "zhqQUwQFVgosQTJL3yBNUkObDZiEfsTs";
                    query["size"] = "200";
                    query["page"] = "0";

                    builder.Query = query.ToString();
                    string url = builder.ToString();

                    using (var response = await client.GetAsync(url))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            string responseData = await response.Content.ReadAsStringAsync();
                            return responseData;
                        }
                        else
                        {
                            return this.BadRequest(new ReturnMessage { Message = response.StatusCode.ToString() });
                        }

                    }
                }
            }
            catch (Exception e)
            {
                return this.BadRequest(new { Message = e.Message });
            }
        }
    }
}
