(function(exports){
  var redis = require("redis"), client = redis.createClient(9887, "barreleye.redistogo.com");

  initDatabase();

  function initDatabase(){
    client.auth("");
    client.on("error", function (err) {
        console.log("Database error " + err);
    });
  }

  exports.getClient = function(){
    return client;
  }

})(exports);
