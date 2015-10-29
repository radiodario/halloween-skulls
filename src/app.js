var THREE = require('three.js');
require('./vendor/OBJLoader.js')(THREE);
var SimplexNoise = require('simplex-noise');

var t = 0;
var simplex = new SimplexNoise();


var container;
var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth/2;
var windowHalfY = window.innerHeight/2;


var skullGeom, skullMat;

var skulls = [];

var width = 16;
var height = 8;
var maxSkulls = width * height;
var padY = 45;
var padX = 38;

init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild( container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  //camera.position.set(250, 250, 400);
  var camX = width * padX / 2;
  var camY = height * padY / 2;
  var camZ = 400;

  camera.position.set(camX, camY, camZ);
  camera.lookAt(camX, camY, 0)

  scene = new THREE.Scene();

  var ambient = new THREE.AmbientLight(0x101030);
  scene.add(ambient);

  var directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  var manager = new THREE.LoadingManager();
  manager.onProgress = function(item, loaded, total) {
    console.log(item, loaded, total);
  };

  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function ( xhr ) {
  };


  // model

  var loader = new THREE.OBJLoader( manager );
  loader.load( 'data/skull.obj', function ( object ) {
    var skullMesh = object.children[0];
    skullGeom = skullMesh.geometry;
    skullMat = skullMesh.material;

    addSkulls();

  }, onProgress, onError );


  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  window.addEventListener( 'resize', onWindowResize, false )

}

function addSkulls() {
  for (var i = 0; i < maxSkulls; i++) {
    var mesh = new THREE.Mesh(skullGeom, skullMat);
    var xGrid = i % width;
    var yGrid = i / width | 0;
    mesh.position.set(padX * xGrid, padY * yGrid, 0);
    mesh.scale.set(7,7,7);
    scene.add(mesh);
    skulls.push(mesh);
  }

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  //mouseX = ( event.clientX - windowHalfX ) / 2;
  //mouseY = ( event.clientY - windowHalfY ) / 2;

}

//

function twiddleSkulls() {
  var sk;
  t += 0.005;
  var rotY;
  for (var i = 0; i < skulls.length; i++) {
    //if (Math.random() > 0.2) continue;
    sk = skulls[i];
    rotY = (-0.5 + simplex.noise2D(t, i)) * 0.5;
    sk.rotation.set(0, rotY, 0)
  }
}

function animate() {

  requestAnimationFrame( animate );

  twiddleSkulls();

  render();

}

function render() {

  //camera.position.x += ( mouseX - camera.position.x ) * .05;
  //camera.position.y += ( mouseY - camera.position.y ) * .05;

  //camera.lookAt( scene.position );

  renderer.render( scene, camera );

}
