import * as THREE from './three.js';
import { OBJLoader } from './OBJLoader.js';
import { OrbitControls } from './orbit.js'
import { MTLLoader } from './MTLLoader.js'

let scene, camera, renderer, controls, card;
const container = document.getElementById('card-container');


function init(){
    window.addEventListener( 'resize', onWindowResize );

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1000;
    camera.rotation.z = Math.PI / 2;

    let light = new THREE.AmbientLight(0xffffff, 100);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    controls = new OrbitControls( camera, renderer.domElement );
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;

    // load card
    new MTLLoader().load('card.mtl', function(materials) {
        materials.preload();
        new OBJLoader()
            .setMaterials(materials)
            .load('card.obj', function(obj) {
                card = obj; // copy element
                scene.add(card); // add element to scene
                card.rotation.y = Math.PI; // le model est a l'envers fix bugger
                card.rotation.x = Math.PI / 2; // rotation pour fixer le model
                renderer.render(scene, camera); // refresh le render
                animate(); // lancer l'animation
            }, function (xhr) {
                // console.log((xhr.loaded / xhr.total * 100 ) + '% loaded');
            },
        );
    });
}


function animate() {
	requestAnimationFrame(animate);
    
    const time = Date.now() / 1000; // trouvé sur stackoverflow
    card.rotation.y = Math.sin(time / 4) / 4 - Math.PI; // trouver par tatonement
    card.rotation.x = Math.sin(time / 2 ) / 2 + Math.PI / 2; // same
    card.rotation.z = Math.sin(time / 2) / 2; // same

	controls.update();
	renderer.render(scene, camera);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


init();