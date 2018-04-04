using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AttributeRouting.Web.Mvc;

namespace test.Controllers
{
    public class testController : Controller
    {
        [GET("test")]
        [AllowAnonymous]
        public ActionResult test()
        {
            return View();
        }

        [GET("testpop")]
        [AllowAnonymous]
        public ActionResult testpop()
        {
            return View();
        }
    }
}
