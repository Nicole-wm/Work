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

        [GET("test1")]
        [AllowAnonymous]
        public ActionResult test1()
        {
            return View();
        }

        [GET("test2")]
        [AllowAnonymous]
        public ActionResult test2()
        {
            return View();
        }

        [GET("test3")]
        [AllowAnonymous]
        public ActionResult test3()
        {
            return View();
        }
    }
}
