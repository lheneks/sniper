using System.Web;
using System.Web.Optimization;

namespace sniper
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/libjs")
                        .Include("~/Scripts/bootstrap.js")
                        .Include("~/Scripts/underscore.js")
//                        .Include("~/Scripts/angular.js")
//                        .Include("~/Scripts/angular-route.js")
//                        .Include("~/Scripts/angular-animate.js")
                        .Include("~/Scripts/localStorageModule.js")
                        .Include("~/Scripts/angular-block-ui.js")
                        );
            
            bundles.Add(new ScriptBundle("~/bundles/appjs")
                        .Include("~/Scripts/__common.js")
                        .Include("~/Scripts/__services.js")
                        .Include("~/Scripts/__app.js")
                        );

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/angular-block-ui.css",
                      "~/Content/site.css"
                      ));

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
#if !DEBUG
            BundleTable.EnableOptimizations = true;
#endif
        }
    }
}
