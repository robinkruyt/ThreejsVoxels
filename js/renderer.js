(function(exports, THREE){
  var v = require("voxel");
  var SimplexNoise = require("SimplexNoise").SimplexNoise;

  var scene, renderer, camera, controls, noise;
  var spotLight;
  var clock = new THREE.Clock();

  // For rotation
  var center = new THREE.Vector3( 64, 0, 64 );
  var wave = 0;
  var screenshot; // should a screenshot be taken?

  exports.init = function(screenshotParam){
    if(screenshotParam){
      screenshot = screenshotParam;
    }else{
      screenshot = false;
    }

    log("Starting");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.y = 64;

    //controls = new THREE.StrategyControls(camera);
    camera.lookAt(center);
    //controls.keys = { LEFT: 65, UP: 87, RIGHT: 68, BOTTOM: 83 };

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = camera.far;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 512;
    renderer.shadowMapHeight = 512;
    $("#viewport").append(renderer.domElement);

      var light = new THREE.AmbientLight( 0x404040 ); // soft white light
      scene.add( light );

      directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
      directionalLight.shadowCameraVisible = false;
      directionalLight.position.set( 64,500,64 );
      directionalLight.target.position.set( 0,0,0 );
      directionalLight.castShadow = true;

      scene.add( directionalLight );


      initTerrain();
    };

    exports.screenshot = function(){
      return renderer.domElement.toDataURL("image/png").replace("data:image/png;base64,", "");
    };

  function initTerrain(){
    log("init terrain");
    var material = new THREE.MeshLambertMaterial( { ambient: 0xffffff, color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors } );
    var geometry = new THREE.Geometry();
    voxel = v.Voxel({});

    log("collecting data");

      var noise = new SimplexNoise();
      for(var x = 0; x < v.WIDTH; x++){
        for(var z = 0; z < v.DEPTH; z++){
          var h = parseInt(noise.noise(x/128, z/128)*v.HEIGHT/12)*6;
          for(var y = 0; y < v.HEIGHT; y++){
            var type = 0;
            if(y<h){
              type = 3;
            }else if(y==h){
              type = 2;
            }else if(y === 0){
              type = 1;
            }
            if(type != 0)
              voxel.setType(type,x,y,z);
          }
        }
      }

      var top = {};

      for(var x = 0; x <= voxel.WIDTH; x++){
        for(var z = 0; z <= voxel.DEPTH; z++){
          for(var y = 0; y < voxel.HEIGHT; y++){
            if(voxel.getType(x,y,z) !== 0){
              if(voxel.isBlockVisible(x,y,z) || (x===0||z===0||y===0 || x==voxel.WIDTH||z==voxel.DEPTH||y==voxel.HEIGHT)){
                top[voxel.getIndex(x,y,z)] = voxel.getType(x,y,z);
              }
            }
          }
        }
      }

      log("creating world");
      for(var index in top){

        var cube = new THREE.CubeGeometry( 1, 1, 1, 1, 1, 1 );
        var mesh = new THREE.Mesh( cube, material );

        var result = voxel.getXYZ(index);
        var x = result.x;
        var y = result.y;
        var z = result.z;

        var type = top[index];
        mesh.position.x = x;
        mesh.position.y = y;
        mesh.position.z = z;


        for ( var i = 0; i < mesh.geometry.faces.length; i++ ) {
          var f = mesh.geometry.faces[ i ];
          var n = ( f instanceof THREE.Face3 ) ? 3 : 4;
          for( var j = 0; j < n; j++ ) {
            f.vertexColors[ j ] = new THREE.Color( voxel.getColor(type,x,y,z) );
          }
        }

        THREE.GeometryUtils.merge( geometry, mesh );

      }


      var world = new THREE.Mesh( geometry, material );
      world.castShadow = true;
      world.receiveShadow = true;
      scene.add( world );
      
      log("Done building");
      render();
      log("Done rendering");
  }

  function update(){
    //controls.update(clock.getDelta());
    camera.position.y = Math.sin(wave)*20+45;
    camera.position.x = Math.sin(wave)*64+center.x;
    camera.position.z = Math.cos(wave)*64+center.z;
    camera.lookAt(center);      
    wave += 0.01;
  }

  // Render that shit
  function render() { requestAnimationFrame(render, renderer.domElement); update(); renderer.render(scene, camera); }

})(exports, THREE);