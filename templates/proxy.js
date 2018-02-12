// requires
var connect = require("connect"),
  url = require("url"),
  serveStatic = require("serve-static"),
  proxy = require("proxy-middleware");

// settings
var staticPath = "client";
var port = process.env.PORT || 3000;
var proxyTo = "{{proxy}}";

// start up a server
console.log("Starting a server at http://localhost:" + port);
var app = connect();
app
  .use((req, res, next) => {
    if (req.url.startsWith("/api/")) {
      // console.log("to proxy");
      proxy(url.parse(proxyTo))(req, res, next);
    } else {
      // console.log("to static");
      next();
    }
  })
  .use(serveStatic(staticPath))
  .listen(port);
