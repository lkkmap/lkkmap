import * as THREE from 'three';

import { OrbitControls } from './lib/OrbitControls.js';
import { GLTFLoader } from './lib/GLTFLoader.js';

let camera, scene, renderer, paper;
let currentView = "maclehose";

let xpos = {
    "maclehose" : -2,
    "hk" : -0.5
}

init();

function loadView(view) {
    const loader = new GLTFLoader();
    loader.load( 'textures/' + view + '.gltf', async function ( gltf ) {
        paper = gltf.scene;
        await renderer.compileAsync( paper, camera, scene );

        paper.position.set( xpos[view], 0, 0 );

        scene.add( paper );
        render();
    } );

}

function init() {

    let selector = document.querySelector( '#paper' );
    let width = selector.offsetWidth;
    let height = selector.offsetHeight;
    const container = document.createElement( 'div' );
    selector.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, width / height, 0.25, 20 );
    camera.position.set( 0, 2, 2 )

    scene = new THREE.Scene();


    loadView(currentView);

    // let button = document.querySelector( '#switch' );
    // button.addEventListener( 'click', function() {
    //     scene.remove( paper );
    //     if (currentView === "maclehose") {
    //         currentView = "hk";
    //     } else {
    //         currentView = "maclehose";
    //     }
    //     loadView(currentView);
    // })
    

    // lights
    const lights = {};
    lights.ambient = new THREE.AmbientLight(0xffffff, 2.5, 0);
    scene.add(lights.ambient);

    lights.spot = new THREE.SpotLight(0xffffff, 1, 0);
    lights.spot.position.set(300, 200, 100);
    lights.spot.castShadow = true;
    scene.add(lights.spot);

    lights.point = new THREE.PointLight( 0xffffff, 100, 0 );
    lights.point.position.set( 0, 200, 0 );
    scene.add(lights.point)


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    container.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener('change', render ); // use if there is no animation loop
    controls.minDistance = 0;
    controls.maxDistance = 20;
    controls.target.set( 0, 0, - 0.2 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

    let selector = document.querySelector( '#paper' );
    let width = selector.offsetWidth;
    let height = selector.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize( width, height );
    render();
}

function render() {
    renderer.render( scene, camera );

}


function animate() {
    requestAnimationFrame( animate );
    if (paper && paper.rotation) {
        paper.rotation.x += 0.003
        // paper.rotation.y -= 0.001
        // paper.rotation.z += 0.001
    }

    render();
}

animate();