(function(exports){
  client = require("./RedisClient.js").getClient();

  exports.setSector = function(base64){
    client.set("sector:1:image", base64);
  };

  exports.getSector = function(httpresponse){
    client.get("sector:1:image", function (err, reply) {
      if(reply === null){
        httpresponse.writeHead(200, {"Content-Type": "text/plain"});
        httpresponse.write("404.");
        httpresponse.end();
      }else{
        httpresponse.writeHead(200, {"Content-Type": "image/png"});
        httpresponse.write(new Buffer(reply, "base64"));
        httpresponse.end();
      }
        
    });
  };

})(exports);