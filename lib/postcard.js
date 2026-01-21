import * as THREE from 'three';

import { OrbitControls } from './lib/OrbitControls.js';
import { updateNav } from './util.js';

let camera, scene, renderer, plane, xrotation = -1.2, dir;
let requestId = new Date();
let requestObject = {};


function restart() {
    init();
    if (requestObject[requestId]) {
        window.cancelAnimationFrame(requestObject[requestId]);
        requestId = new Date();  
    }
    animate();
}


if(window.location.hash == "#postcard") {
    restart();
    updateNav("postcard");
}

document.querySelector(".button-postcard").addEventListener("click", function(){
    window.location.hash = '#postcard';
    restart();
    updateNav("postcard");
})
  

function init() {

    let selector = document.querySelector( '#canvas ' );
    selector.innerHTML = "";
    let width = selector.offsetWidth;
    let height = selector.offsetHeight;
    const container = document.createElement( 'div' );
    selector.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, width / height, 1, 500 );
    camera.position.set( -15, 15, 100 )

    scene = new THREE.Scene();

    // const axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );

    // textures
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load( 'img/postcard.png' );
    map.encoding = THREE.sRGBEncoding;

    const displacementMap = textureLoader.load( 'img/postcard-displacement.jpg' );

    // material
    let material = new THREE.MeshLambertMaterial({
        color: 0x070707,
        // shininess: 0,
        // roughness: 0.2,
        // metalness: 0.5,

        // normalMap: normalMap,
        // normalScale: new THREE.Vector2( 1, - 1 ), // why does the normal map require negation in this case?

        // aoMap: aoMap,
        // aoMapIntensity: 1,

        displacementMap: displacementMap,
        displacementScale: 1.8,
        // displacementBias: - 0.428408, // from original model

        // envMap: reflectionCube,
        // envMapIntensity: settings.envMapIntensity,

        side: THREE.DoubleSide,

        // bumpMap: displacementMap,
        // bumpScale: 1.3,
        map: map
    });

    let geometry = new THREE.PlaneGeometry( 60, 40, 50, 50 );
    let frontPlane  = new THREE.Mesh( geometry, material );
    frontPlane.castShadow = true;

    let geometry2 = new THREE.PlaneGeometry( 60, 40, 50, 50 );
    geometry2.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI));
    var textureBack = textureLoader.load( 'img/postcardback.png' );
    let material2 = new THREE.MeshLambertMaterial({ color: 0x070707, map: textureBack });
    let backPlane = new THREE.Mesh( geometry2, material2 );

    plane = new THREE.Object3D();
    plane.add( frontPlane );
    plane.add( backPlane );
    scene.add( plane );

    plane.position.set( 10, 2, 0 );
    plane.rotation.set( - 1.2, 0, 0 );

    // lights
    const lights = {};
    lights.ambient = new THREE.AmbientLight(0xffffff, 500, 0);
    // lights.ambient.intensity = 0.5;
    scene.add(lights.ambient);
    
    var light = new THREE.DirectionalLight(0xffffff, 100);
    // light.intensity = 3.0;
    light.castShadow = true;
    light.position.set(0, 100, 100);
    light.position.multiplyScalar(1.3);
    scene.add(light);

    // const spotLight = new THREE.SpotLight(0xffffff, 250);
    // spotLight.position.set(0, 20, 0);
    // // spotLight.angle = Math.PI / 6;
    // // spotLight.penumbra = 0.2;
    // spotLight.castShadow = true;
    // scene.add(spotLight);

    // renderer

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width, height );
    container.appendChild( renderer.domElement );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.addEventListener('change', render ); // use if there is no animation loop
    controls.minDistance = 0;
    controls.maxDistance = 100;
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
    // if (xrotation == -1.5) {
    //     dir = "fwd";
    //     xrotation = plane.rotation.x;
    // } else if (xrotation == -1.1) {
    //     dir = "bwd";
    // }

    // if (dir == "fwd") {
    //     plane.rotation.x += 0.001
    //     plane.rotation.y -= 0.001
    // } else {
    //     plane.rotation.x -= 0.001
    //     plane.rotation.y += 0.001
    // }

    // xrotation = plane.rotation.x.toFixed(1);
    plane.rotation.x += 0.002;
    plane.rotation.y += 0.002;
}

function animate() {
    requestObject[requestId] = requestAnimationFrame( animate );
    render();
}

