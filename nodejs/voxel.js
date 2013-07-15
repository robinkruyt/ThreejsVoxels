(function(exports){
  var self;
  exports.WIDTH = 150;
  exports.DEPTH = 150;
  exports.HEIGHT = 50;
  exports.buffer = {};

  exports.Voxel = function(buffer){
    self = exports;
    self.buffer = buffer;
    return self;
  };

  /*====================== Voxel DATA ========================*/
  exports.getColor = function(type,x,y,z){

    switch(type){
      case 1: // Grass
        return grassTexture(x,y,z);
      case 2: // Brick
        return 0xD93604;
      case 3: // Stone
        return stoneTexture();
      default: // Unknown type
        console.log("Unknown type", type);
        return 0xFF00FF;
    }




    // colors
    function grassTexture(x,y,z){
      return (exports.countHorizontalNeighbours(x,y,z) <= 3)? 0xA0D687 : 0x74C44F;
      //return 0xFF0000;
      /*
      var r = 10;
      var g = 150 + Math.random()*100;
      var b = 10 + Math.random()*10;
      return ( r << 16 ) + ( g << 8 ) + b;*/
    }

    function stoneTexture(){
      return (Math.random() < 0.98)? 0x666666 : 0xADADAD;
    }
  };

  /*====================== Voxel Helpers =====================*/
  exports.getIndex = function(x, y, z){
    return x + z * self.WIDTH + y * self.WIDTH * self.DEPTH;
  };

  exports.getXYZ = function(index){
    return {"x": Math.floor(index % self.WIDTH), "y": Math.floor((index / (self.WIDTH*self.DEPTH))%self.WIDTH), "z": Math.floor((index / self.WIDTH)%self.WIDTH)};
  };

  exports.getType = function(x,y,z){
    var type = self.buffer[self.getIndex(x,y,z)];
    if(type === undefined || (x<0 || x>exports.WIDTH || y < 0 || y > exports.HEIGHT || z < 0 || z > exports.DEPTH)){ return 0; }
    return type;
  };

  exports.setType = function(type, x,y,z){
    self.buffer[self.getIndex(x,y,z)] = type;
  };

  exports.isBlockVisible = function(x, y, z){
    if(x === 0 || z === 0){ return true; } // Blocks on the side are always visible
    return (self.countNeighbours(x,y,z) < 6);
  };

  exports.countNeighbours = function(x, y, z){
    var count = 0;
    if(self.getType(x+1,y,z) !== 0){ count++; }
    if(self.getType(x-1,y,z) !== 0){ count++; }
    if(self.getType(x,y+1,z) !== 0){ count++; }
    if(self.getType(x,y-1,z) !== 0){ count++; }
    if(self.getType(x,y,z+1) !== 0){ count++; }
    if(self.getType(x,y,z-1) !== 0){ count++; }

    return count;
  };
  exports.countHorizontalNeighbours = function(x, y, z){
    var count = 0;

    if(self.getType(x+1,y,z) !== 0){ count++; }
    if(self.getType(x-1,y,z) !== 0){ count++; }
    if(self.getType(x,y,z+1) !== 0){ count++; }
    if(self.getType(x,y,z-1) !== 0){ count++; }

    return count;
  };
})(exports);