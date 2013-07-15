var fs = require("fs");
var v = require("./voxel.js");
var SimplexNoise = require("./simplexnoise.js").SimplexNoise;

// CONSTANTS
var FILENAME = "test";

// PROPERTIES


// Functions
var cache = "";
function getSector(){
  if(cache != "")
    return cache;
  var buffer = read();
  var top = {};
  var voxel = new v.Voxel(buffer);

  for(var x = 0; x <= v.WIDTH; x++){
    for(var z = 0; z <= v.DEPTH; z++){
      for(var y = 0; y < v.HEIGHT; y++){
        if(voxel.getType(x,y,z) !== 0){
          if(voxel.isBlockVisible(x,y,z) || (x===0||z===0||y===0 || x==v.WIDTH||z==v.DEPTH||y==v.HEIGHT)){
            top[voxel.getIndex(x,y,z)] = voxel.getType(x,y,z);
          }
        }
      }
    }
  }
  cache = JSON.stringify(top);
  return cache;
}


function placeObject(object){
  var buffer = read();
  var voxel = new v.Voxel(buffer);

  // Place object
  object.place(voxel);

  // Save
  write(voxel.buffer);
}



function generate(){
  var noise = new SimplexNoise();
  var buffer = new Buffer(v.WIDTH*v.DEPTH*v.HEIGHT);
  var voxel = new v.Voxel(buffer);
  for(var x = 0; x < v.WIDTH; x++){
    for(var z = 0; z < v.DEPTH; z++){
      var h = parseInt(noise.noise(x/128, z/128)*v.HEIGHT/12)*6;
      for(var y = 0; y < v.HEIGHT; y++){
        voxel.setType(0, x,y,z);
        if(y<h){
          voxel.setType(3, x,y,z);
        }else if(y==h){
          voxel.setType(1, x,y,z);
        }else if(y === 0){
          voxel.setType(1, x,y,z);
        }
      }
    }
  }


  write(voxel.buffer);
}


// File Helpers
function write(buffer){
  fs.writeFile(FILENAME, buffer, function(err) {
    if(err) {
        throw err;
    } else {
        console.log("The world was saved!");
    }
  });
}


function read(){
  return fs.readFileSync(FILENAME);
}

exports.getSector = getSector;
exports.generate = generate;
exports.placeObject = placeObject;
exports.generate = generate;