/**
  test.js
  Ejemplo Three.js_r140: Cubo RGB con iluminacion y textura

  Cubo con color por vertice y mapa de uvs usando la clase BufferGeometry.
  La textura es una unica imagen en forma de cubo desplegado en cruz horizontal.
  Cada cara se textura segun mapa uv en la textura.
  En sentido antihorario las caras son:
    Delante:   7,0,3,4
    Derecha:   0,1,2,3
    Detras:    1,6,5,2
    Izquierda: 6,7,4,5
    Arriba:    3,2,5,4
    Abajo:     0,7,6,1
  Donde se han numerado de 0..7 los vertices del cubo.
  Los atributos deben darse por vertice asi que necesitamos 8x3=24 vertices pues
  cada vertice tiene 3 atributos de normal, color y uv al ser compartido por 3 caras. 

  @author rvivo@upv.es (c) Libre para fines docentes
*/

var renderer, scene, camera, cubo;
var cameraControls;
var angulo = -0.01;

init();
render();

function init()
{
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( new THREE.Color(0xFFFFFF) );
  document.getElementById('container').appendChild( renderer.domElement );

  scene = new THREE.Scene();

  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera( 50, aspectRatio , 0.1, 100 );
  camera.position.set( 1, 15, 2 );
  camera.lookAt(0,0,0);

  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set( 0, 0, 0 );

  window.addEventListener('resize', updateAspectRatio );

  cubeGeo = new THREE.BoxGeometry(1, 0.1, 1);
	whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xc0c0c0} );
	blackMaterial = new THREE.MeshBasicMaterial({ color: 0x0c0c0c} );

	board = new THREE.Group();

	for (let x = 0; x < 8; x++) {
		for (let y = 0; y < 8; y++) {
			var cube;
			if( (y + x) % 2 == 0) {
				cube = new THREE.Mesh(cubeGeo, whiteMaterial);
			} else {
				cube = new THREE.Mesh(cubeGeo, blackMaterial);
			}
			cube.position.set(x - 4, 0, y - 4);
			board.add(cube);
		}
	}

	scene.add(board);
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