//Nécessite de lancer le projet sur un serveur local
//import du loader -> permet d'importer les modeles 3D
import { GLTFLoader } from "./GLTFLoader.js";

//creation de la 'scene'
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,5000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//creation de la skybox et import des images utilisees pour la skybox 
let materialArray = [];
let texture_front = new THREE.TextureLoader().load('images/front.png');
let texture_back = new THREE.TextureLoader().load('images/back.png');
let texture_up = new THREE.TextureLoader().load('images/up.png');
let texture_down = new THREE.TextureLoader().load('images/down.png');
let texture_right = new THREE.TextureLoader().load('images/left.png'); //images 'droite' et 'gauche' inversees.
let texture_left = new THREE.TextureLoader().load('images/right.png');

materialArray.push(new THREE.MeshBasicMaterial({map: texture_front}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_back}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_down}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_right}));
materialArray.push(new THREE.MeshBasicMaterial({map: texture_left}));


//permet de retourner le cube-->les textures sont à l'intérieur de la skybox
for(let i=0;i<6;i++){
	materialArray[i].side = THREE.BackSide;
}

let skyboxGeo = new THREE.BoxGeometry(1000,1000,1000);
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);



//utilisation du GLTFLoader pour importer les modeles 3D
var loader = new GLTFLoader();


//import du modele 3D de la terre
var earth;
loader.load("earth2.gltf", function(gltf){
	earth = gltf.scene;

	//positionement de la Terre
	gltf.scene.position.set(-5.5,0,0);
	scene.add(gltf.scene);
});


//import du modele 3D de l'iss
var iss;
loader.load("ISSsmall.gltf", function(gltf){
	iss = gltf.scene;
	scene.add(gltf.scene);

});

//lumière et couleur de fond 
var lights = new THREE.HemisphereLight(0xffffff, 0x000000, 5);
scene.add(lights);

//position de la caméra
camera.position.set(8,10,12);

//utilisation du module ThreeJS OrbitControls 
var controls = new THREE.OrbitControls(camera, renderer.domElement);
//empeche l'utilisateur de 'sortir' de la skybox
controls.maxDistance = 500;

//creation d'une petite sphere qui servira pour les click events sur l'ISS --> on aura une sorte de hit box de forme spherique autour de l'ISS (invisible bien sûr)
const geometry = new THREE.SphereGeometry( 0.7, 100, 100 );
const material = new THREE.MeshBasicMaterial( { 
	color: 0xffff00,
	opacity: 0,
	transparent: true, 
});
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );

//ajout des events sur l'iss
const domEvents = new THREEx.DomEvents( camera, renderer.domElement);
domEvents.addEventListener(sphere, 'click', event => {
	console.log("ISS clicked");
});


//affichage de l'orbite
const geometry2 = new THREE.TorusGeometry( 6, 0.02, 10, 100 );
const material2 = new THREE.MeshBasicMaterial( { color: 0xffffff } );
const orbit = new THREE.Mesh( geometry2, material2 );
scene.add( orbit );

//positionnement de l'orbite-->sa position sera toujours la meme 
orbit.position.set(-5.5,0,0);


		
//variables pour l'orbite
var alpha = 0;
var radius = 6;
let theta;


//on récupère les données du json
fetch("data.json").then(function (response){
	return response.json();
}).then(function (data) {
	console.log(data);
	data = JSON.parse(data);

}).catch(function(error){
	console.error(error);
});   

//fonction animer
function animate(){
	requestAnimationFrame(animate);
	
	//rotation de la Terre 
	earth.rotation.y += 0.001;
	earth.rotation.x += 0.001;

	//creation de l'orbite

	//evolution de l'anngle theta
	if(alpha < 360){
		alpha += 0.15;
		theta = alpha*(Math.PI/180);
	}

	//apres un tour complet (360°), l'angle repasse a 0
	if(alpha>=360){
		alpha = 0;
	}

	//trajectoire circulaire autour de la Terre
	iss.position.x = radius*Math.cos(theta);
	iss.position.y = radius*Math.sin(theta);
	
	//ajustement de la position de la hitbox (sphere) a la position de l'ISS
	sphere.position.x = iss.position.x - 5.5;
	sphere.position.y = iss.position.y;
	sphere.position.z = iss.position.z;
	renderer.render(scene, camera);

}

animate();

