using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Raven.Client;
using sniper.Common.Mapping;
using sniper.Models;

namespace sniper.Controllers
{
    public class SearchConfigApiController : RavenController
    {
        public JsonResult GetConfig(int id)
        {
            var current = RavenSession.Load<SearchConfig>(id);

            current.LatestRun = RavenSession.Query<SearchData>()
                                            .Where(sd => sd.SearchConfigId == id)
                                            .OrderByDescending(sd => sd.SearchTime)
                                            .FirstOrDefault();

            if (current.LatestRun != null)
            {
                current.LatestRun.Results.ForEach(i=>i.IsFoil = i.Title.ToLower().Contains("foil"));
            }

            return Json(current);
        }

        public JsonResult AddOrUpdateSearchConfig(SearchConfig config)
        {
            SearchConfig current = config;

            if (config.Id > 0)
            {
                current = RavenSession.Load<SearchConfig>(config.Id);
                Update.Model(config, current);
            }

            RavenSession.Store(current);

            return Json(new {Message = "Success"});
        }

        public JsonResult List()
        {
            var searchConfigs = RavenSession.Query<SearchConfig>().ToList();

            return Json(searchConfigs);
        }

        public void SaveRunData(SearchData data)
        {
            RavenSession.Store(data);
        }
    }
}