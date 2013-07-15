/**
 * Based on: FlyControls - James Baicoianu / http://www.baicoianu.com/
 */

THREE.StrategyControls = function ( object ) {

  this.object = object;

  this.domElement = document;

  // API
  this.movementSpeed = 20.0;

  // disable default target object behavior
  this.object.useQuaternion = true;

  // internals

  this.tmpQuaternion = new THREE.Quaternion();

  this.mouseStatus = 0;

  this.moveState = { left: 0, right: 0, forward: 0, back: 0 };
  this.moveVector = new THREE.Vector3( 0, 0, 0 );

  this.handleEvent = function ( event ) {

    if ( typeof this[ event.type ] == 'function' ) {

      this[ event.type ]( event );

    }

  };

  this.keydown = function( event ) {

    if ( event.altKey ) {

      return;

    }

    //event.preventDefault();

    switch ( event.keyCode ) {

      case 87: /*W*/ this.moveState.forward = 1; break;
      case 83: /*S*/ this.moveState.back = 1; break;

      case 65: /*A*/ this.moveState.left = 1; break;
      case 68: /*D*/ this.moveState.right = 1; break;

    }

    this.updateMovementVector();

  };

  this.keyup = function( event ) {

    switch( event.keyCode ) {


      case 87: /*W*/ this.moveState.forward = 0; break;
      case 83: /*S*/ this.moveState.back = 0; break;

      case 65: /*A*/ this.moveState.left = 0; break;
      case 68: /*D*/ this.moveState.right = 0; break;

    }

    this.updateMovementVector();

  };


  this.update = function( delta ) {

    var moveMult = delta * this.movementSpeed;

    this.object.translateX( this.moveVector.x * moveMult );
    this.object.translateY( this.moveVector.y * moveMult );
    this.object.translateZ( this.moveVector.z * moveMult );

  };

  this.updateMovementVector = function() {

    this.moveVector.x = ( -this.moveState.left    + this.moveState.right);
    this.moveVector.y = ( this.moveState.forward - this.moveState.back );
    this.moveVector.z = ( -this.moveState.forward + this.moveState.back);

  };

  this.getContainerDimensions = function() {

    if ( this.domElement != document ) {

      return {
        size  : [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
        offset  : [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
      };

    } else {

      return {
        size  : [ window.innerWidth, window.innerHeight ],
        offset  : [ 0, 0 ]
      };

    }

  };

  function bind( scope, fn ) {

    return function () {

      fn.apply( scope, arguments );

    };

  };

  this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

  this.domElement.addEventListener( 'keydown', bind( this, this.keydown ), false );
  this.domElement.addEventListener( 'keyup',   bind( this, this.keyup ), false );

  this.updateMovementVector();

};