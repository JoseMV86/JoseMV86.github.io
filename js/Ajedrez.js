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


*/

var renderer, scene, camera, cubo;
var cameraControls;
var angulo = -0.01;

init();
render();

async function init()
{
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( new THREE.Color(0xFFFFFF) );
  document.getElementById('container').appendChild( renderer.domElement );

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog( 0xFFFFFF, 10, 40 );

  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera( 50, aspectRatio , 0.1, 100 );
  camera.position.set( -0.5, 4, 0 );
  document.body.appendChild(renderer.domElement);

  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set( 0, 0, 0 );

  window.addEventListener('resize', updateAspectRatio );
  window.addEventListener("keydown", onDocumentKeyDown, false);

  cubeGeo = new THREE.BoxGeometry(1, 0.1, 1);
  sphereGeo = new THREE.SphereGeometry(0.5, 15, 15);
	whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xc0c0c0} );
	blackMaterial = new THREE.MeshBasicMaterial({ color: 0x0c0c0c} );
  greenMaterial = new THREE.MeshBasicMaterial({ color: 0x03c04a} );
  yellowMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00} );
  redMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000} );

	board = new THREE.Group();
  boardCubes = [];
  for (let x = 0; x < 8; x++) {
    boardCubes[x] = [];
  }
	for (let x = 0; x < 8; x++) {
		for (let y = -8; y < 32; y++) {
			if( (y + x) % 2 == 0) {
				cube = new THREE.Mesh(cubeGeo, whiteMaterial);
			} else {
				cube = new THREE.Mesh(cubeGeo, blackMaterial);
			}
      boardCubes[x][y] = cube;
			cube.position.set(x - 4, 0, y);
			board.add(cube);
		}
	}

  scene.add(board);
  locked = false;
  evlocked = false;
  coin = new THREE.Mesh(sphereGeo, yellowMaterial);
  evcoin = new THREE.Mesh(sphereGeo, redMaterial);
  playableSphere = new THREE.Mesh(sphereGeo, greenMaterial);
  playableSphere.position.set(-0.5, 0.5, 0);
  scene.add(playableSphere);
  scrollSpeed = 1;
}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function onDocumentKeyDown(event) {
  var keyCode = event.which;
  
  if (keyCode == 39){
      if (playableSphere.position.x > -4){
          playableSphere.position.x -=0.5;
      }
  } else if(keyCode == 37){
      if (playableSphere.position.x < 3){
        playableSphere.position.x +=0.5;
      }
  }
  
};

function update()
{
  // Cambios para actualizar la camara segun mvto del raton
  cameraControls.update();
  for (let x = 0; x < 8; x++) {
		for (let y = -8; y < 32; y++) {
      cube = boardCubes[x][y];
      if (cube.position.z <= -9) {
          cube.position.set(cube.position.x, 0, 31);
      } else {
          cube.position.set(cube.position.x, 0, cube.position.z - 0.025);
      }
		}
	}
  if (!locked) {
    locked = true;
    randomInt = Math.round(Math.random()*7) - 4;
    coin.position.set(randomInt, 0.5, 26);
    scene.add(coin);
  } else {
    coin.position.set(coin.position.x, 0.5, coin.position.z - 0.05 * scrollSpeed);
    if (Math.abs(coin.position.z - playableSphere.position.z) < 0.5 && Math.abs(coin.position.x - playableSphere.position.x) <= 0.5) {
      scene.remove(coin);
      locked = false;
      scrollSpeed += 0.25;
    } else if (coin.position.z <= -2) {
      scene.remove(coin);
      locked = false;
    }
  }
  if (!evlocked) {
    evlocked = true;
    while (Math.abs(randomInt - coin.position.x) <= 0.5) {
      randomInt = Math.round(Math.random()*7) - 4;
    }
    evcoin.position.set(randomInt, 0.5, 26);
    scene.add(evcoin);
  } else {
    evcoin.position.set(evcoin.position.x, 0.5, evcoin.position.z - 0.05 * scrollSpeed * 1.5);
    if (Math.abs(evcoin.position.z - playableSphere.position.z) < 0.5 && Math.abs(evcoin.position.x - playableSphere.position.x) <= 0.5) {
      scene.remove(evcoin);
      evlocked = false;
      scrollSpeed = 1;
    } else if (evcoin.position.z <= -2) {
      scene.remove(evcoin);
      evlocked = false;
    }
  }
}

function render()
{
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}