using System.Web.Mvc;
using System.Xml.Linq;
using Raven.Client;
using sniper.Common;

namespace sniper.Controllers
{
    public class RavenController : Controller
    {
        public IDocumentSession RavenSession { get; protected set; }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            RavenSession = MvcApplication.DocumentStore.OpenSession();
        }

        protected override void OnActionExecuted(ActionExecutedContext filterContext)
        {
            if (filterContext.IsChildAction)
                return;

            using (RavenSession)
            {
                if (filterContext.Exception != null)
                    return;

                if (RavenSession != null)
                    RavenSession.SaveChanges();
            }

            TaskExecutor.StartExecuting();
        }

        protected HttpStatusCodeResult HttpNotModified()
        {
            return new HttpStatusCodeResult(304);
        }

        protected new JsonResult Json(object data)
        {
            return base.Json(data, JsonRequestBehavior.AllowGet);
        }
    }
}