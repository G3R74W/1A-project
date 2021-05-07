var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshPhongMaterial({color:"#0e4020"}) ;
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

//ajout d'une lumière ambiante permettant de voir les objets
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.5);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
directionalLight.position.set(1,1,0);
scene.add(directionalLight);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

function animate(){
    requestAnimationFrame( animate) ;

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();