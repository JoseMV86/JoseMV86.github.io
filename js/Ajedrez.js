
import * as THREE from "lib/three.min_r140.js";

var scene, camera, renderer, cameraControls;

var board, cubeGeo, whiteMaterial, blackMaterial, ambientLight;

init();
loadCubo(1.0);
render();

function init()
{
	var aspectRatio = window.innerWidth / window.innerHeight;
  	camera = new THREE.PerspectiveCamera( 50, aspectRatio , 0.1, 100 );
  	camera.position.set( 1, 1.5, 2 );
  	camera.lookAt(0,0,0);
	scene = new THREE.Scene();
	window.addEventListener('resize', updateAspectRatio );

	renderer = new THREE.WebGLRenderer();
  	renderer.setSize( window.innerWidth, window.innerHeight );
  	renderer.setClearColor( new THREE.Color(0xFFFFFF) );
	document.getElementById('container').appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 50, aspectRatio , 0.1, 100 );
	camera.position.set( 1, 1.5, 2 );
  	camera.lookAt(0,0,0);

  	cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  	cameraControls.target.set( 0, 0, 0 );

	ambientLight = new THREE.AmbientLight(0xffffff);
	ambientLight.intensity = 0.1;
	scene.add(ambientLight);
	
}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function update()
{
  // Cambios para actualizar la camara segun mvto del raton
  cameraControls.update();
}

function render()
{
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}
