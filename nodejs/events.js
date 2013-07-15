(function(exports){
  var redis = require("redis"), client = redis.createClient(9887, "barreleye.redistogo.com");

  initDatabase();


  function initDatabase(){
    client.auth("4f6abcab00fe2faa87e67f6a849fbd22");
    client.on("error", function (err) {
        console.log("Database error " + err);
    });
  }
})(exports);




/*

client.set("stringkey", "string val");

client.get("stringkey", function(err, reply) {
  // reply is null when the key is missing
  console.log(reply);
});


*/