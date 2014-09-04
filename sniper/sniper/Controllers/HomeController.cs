using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Raven.Client;

namespace sniper.Controllers
{
    public class HomeController : RavenController
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}