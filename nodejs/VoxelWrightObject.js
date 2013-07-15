(function(exports){
  var SIZE = 32;
  var buffer;

  var topLeft = {"x": 999, "z": 999 };
  var bottomRight = {"x": 0, "z": 0 };


  exports.createObjectFromJson = function(json){
    var voxelWrightJSON = JSON.parse(json);

    // First get the bounds
    for(var positionString in voxelWrightJSON){
      var position = convertString(positionString);
      if(topLeft.x > position.x){ topLeft.x = position.x; }
      if(topLeft.z > position.z){ topLeft.z = position.z; }

      if(bottomRight.x < position.x){ bottomRight.x = position.x; }
      if(bottomRight.z < position.z){ bottomRight.z = position.z; }
    }

    // Add object to buffer. Begin at 0.
    buffer = new Buffer(SIZE*SIZE*SIZE);
    for(var x = 0; x < SIZE; x++){
    for(var z = 0; z < SIZE; z++){
    for(var y = 0; y < SIZE; y++){
      var type = voxelWrightJSON[convertXYZ(x + topLeft.x, y, z+topLeft.z)];
      if(type === undefined){
        buffer[exports.getIndex(x,y,z)] = 0;
      }else{
        buffer[exports.getIndex(x,y,z)] = 3;
      }
      
    }}}

    // Change bounds
    bottomRight.x = bottomRight.x - topLeft.x;
    bottomRight.z = bottomRight.z - topLeft.z;
    topLeft.x = 0;
    topLeft.z = 0;
    
    
    return this;

    function convertString(string){
      var pos = string.split(",");
      return {"x": parseInt(pos[0]),"z": parseInt(pos[1]),"y": parseInt(pos[2])};
    }
    function convertXYZ(x,y,z){
      return x+","+z+","+y; // Voxelwright uses Z for up. We use Y
    }
  };

  exports.place = function(voxel){
    var position = getBestPosition();
    console.log("found position at", position);
    for(var x = 0; x < SIZE-bottomRight.x; x++){
    for(var z = 0; z < SIZE-bottomRight.z; z++){
    for(var y = 0; y < SIZE; y++){
      var type = buffer[exports.getIndex(x,y,z)];
      if(type !== 0)
        voxel.setType(type, position.x+x, position.y+y, position.z+z);
    }}}

    addFoundation();

    function addFoundation(){
      for(var y = position.y-1; y >= 0; y--){
      for(var x = position.x; x <= position.x+bottomRight.x; x++){
      for(var z = position.z; z <= position.z+bottomRight.z; z++){
        voxel.setType(3, x, y, z);
      }}}
    }

    function getBestPosition(){
      for(var y = 0; y < voxel.HEIGHT; y++){
      for(var x = Math.round(Math.random()*32); x < voxel.WIDTH; x++){
      for(var z = Math.round(Math.random()*32); z < voxel.DEPTH; z++){
        var type = voxel.getType(x,y,z);
        if(type === 0){ // Cant place here? Skip
          // Found a place where one block fits. Check other end.
          if(voxel.getType(x+bottomRight.x,y,z+bottomRight.z) === 0){
            // Found a place where we probably fit.
            return {"x":x,"y":y,"z":z};
          }
        }
      }}}
    }
  };

  exports.getIndex = function(x, y, z){
    return x + z * SIZE + y * SIZE * SIZE;
  };


})(exports);