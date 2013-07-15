var http = require("http");
var url = require("url");
var fs = require("fs");

var sectorImage = require("./sectorImage.js");


function start(world) {

  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log("Got request", request.method, pathname);
    
    switch(pathname){
      case "/":
        main(response);
      break;
      case "/sector":
        sector(response);
      break;
      case "/sectorimage":
        if (request.method == 'POST') {
          var fullBody = '';
          
          request.on('data', function(chunk) {
            fullBody += chunk.toString();
          });
          
          request.on('end', function() {
            response.end();
            sectorImage.setSector(fullBody);
          });
      
        } else {
          sectorImage.getSector(response);
        }
      break;
      case "/generate":
        world.generate();
        main(response);
      break;
      case "/favicon.ico":
      break;
      case "/voxel.js":
        response.writeHead(200);
        response.write(fs.readFileSync("./voxel.js"));
        response.end();
      break;
      case "/SimplexNoise.js":
        response.writeHead(200);
        response.write(fs.readFileSync("./SimplexNoise.js"));
        response.end();
      break;
      case "/three.min.js":
        response.writeHead(200);
        response.write(fs.readFileSync("../three.min.js"));
        response.end();
      break;
      default:
        response.writeHead(200);
        response.write(fs.readFileSync(".." + pathname));
        response.end();
    }

    
  }

  function main(response){
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(fs.readFileSync("../index.html"));
    response.end();
  }

  function sector(response){
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(world.getSector());
    response.end();
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;