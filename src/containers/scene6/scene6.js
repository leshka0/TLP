import React, { Component } from 'react'
import { Link } from 'react-router'
import { BASE_URL } from '../../constants/environment'
import THREE from 'three'
import * as flags from './webgl/flags';
import {GroupLoader} from '../../lib/asset-loader/index'
import Sounds from '../../components/sounds/sounds'
import Howler from 'howler'

import lights from './webgl/lights'
import cameras from './webgl/cameras'
import renderer from './webgl/renderer'
import scene from './webgl/scene'


const OrbitControls = require('three-orbit-controls')(THREE)
var manifest

// camera controls
var mouseX = 0 
var mouseY = 0
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
function onDocumentMouseMove(event) {
	mouseX = ( event.clientX - windowHalfX ) * 1;
	mouseY = ( event.clientY - windowHalfY ) * 1;
}
document.addEventListener( 'mousemove', onDocumentMouseMove, false );
var lookAtVector = new THREE.Vector3(0,0,0)
var skyboxMesh
var counter = 0
var gravityspeed = 0.0008

export default class Scene6 extends Component {

	constructor(props) {
		super(props)
	}

	componentDidMount() {

		const loader = new AssetLoader.GroupLoader()

		manifest = [
			 {id: 'prince', src: `${BASE_URL}/videos/chapter6/prince.webm`, type: 'video'}
			,{id: 'skybox', src: `${BASE_URL}/images/chapter6/skybox.jpg`, type: 'image'}
		]

		loader.load(manifest).then((assets) => { 
			console.log('assets loaded');
			this._assets = assets
			this._initWebgl()
		}).catch(error => {
			console.log('error loading assets', error);
		})
	}

	componentWillUnmount() {

		// TO DO : UNMOUNT THE VIDEO !!

		this._cancelRAF = true

		this._scene = null
		this._cameras = null

		this._renderer.domElement.removeEventListener('dblclick', null, false)
		this._renderer.domElement = null

		window.removeEventListener('resize', this._onResizeHandler)

		this._controls.dispose()
	}

	

	_initWebgl() {

		var sound = new Sounds();
		sound.transitionIn(6);

		

		// Use to stop update
		this._cancelRAF = false

		this._renderer = new renderer()
		this._scene = new scene()
		this._cameras = new cameras()
		this._lights = new lights()

		// this._renderer
		this.refs.webgl.appendChild( this._renderer.domElement )

		// Lights
		for( let id in this._lights ){
			this._scene.add(this._lights[id]);
		};


		//  --  APP  -- //

		
		// find image test
		function findImage(image) {
			return image.id === 'skybox';
		}
		function findVideo(video) {
			return video.id === 'prince';
		}
		console.log( manifest.find(findImage).src )  
		// end

		//SKYBOX
		var materialArray = []
		var urls = manifest.find(findImage).src;
		for (var i = 0; i < 6; i++)
			materialArray.push( new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture( urls ),
				side: THREE.BackSide
			}));
		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );

		
		// Skybox
		var shader = THREE.ShaderLib[ "cube" ];
		var skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 1000, 1000, 1000 ), skyMaterial ); 
		this._scene.add(skyboxMesh); 

		console.log (skyboxMesh)

		// EARTH

		var sunvideo = document.createElement( 'video' );
		sunvideo.src = manifest.find(findVideo).src;
		sunvideo.loop = true; // must call after setting/changing source
		sunvideo.play(); 
		var videoImage = document.createElement( 'canvas' );
		videoImage.width = 2048;
		videoImage.height = 2048;

		var videoImageContext = videoImage.getContext( '2d' );
	
		var textureFlare0 = new THREE.Texture( videoImage );

		TweenLite.ticker.addEventListener("tick", function(){
			videoImageContext.drawImage(sunvideo, 0, 0, 2048, 2048);
			textureFlare0.needsUpdate = true;
		});
		textureFlare0.repeat.set( 3, 3 );
		textureFlare0.offset.set( -0.6, -0.4 );
		
		var geometry = new THREE.SphereGeometry( 100, 128, 128 )
		var material = new THREE.MeshPhongMaterial( {
			color: 0xffffff, 
			map: textureFlare0,
			bumpMap: textureFlare0,
			bumpScale: 0.7,
			emissive: 0x010713,
			specularMap: textureFlare0,
			specular: 0xffffff,
    		combine: THREE.MixOperation,
			reflectivity: 5, 
			shading: THREE.SmoothShading, 
			wireframe:false} )
		var earth = new THREE.Mesh( geometry, material )
		earth.castShadow = false
		earth.receiveShadow = false
		
		earth.position.set( 4, -69, -48 )
		earth.scale.set( 1, 1, 1 )
		earth.rotation.set( 6.9, 11, 2.1 )

		this._scene.add( earth )

		


		//  --  END  -- //

			this._cameras.user.position.set( 0, 28, 300 );
			this._cameras.dev.position.set( 0, 28, 119 );
			TweenMax.to(this._lights.directional, 25, {intensity:1})
			TweenMax.to(this._lights.point, 25, {intensity:1})
			TweenMax.to(this._cameras.user.position, 105, {z:50})
			TweenMax.to(earth.rotation, 105, {y:12})
		

		// Helpers
		if( flags.showHelpers ){
			this._scene.add( new THREE.GridHelper( 50, 10 ) );
			this._scene.add( new THREE.AxisHelper( 10 ) );
		}

		// Controls
		this._controls = new OrbitControls( this._cameras.dev, this._renderer.domElement );

		this._zoom( this._cameras.dev, 100 );

		// Bind
		this._resize()
		this._bind()
		this._update();

		
	}

	_bind() {
		this._onResizeHandler = this._resize.bind(this)
		window.addEventListener('resize', this._onResizeHandler);
	}

	_zoom( camera, zoom ){
		//camera.position.set( 1 * zoom, 0.75 * zoom, 1 * zoom );
		camera.lookAt( new THREE.Vector3() );
	}

	_update(){

		if(this._cancelRAF) return

		requestAnimationFrame( this._update.bind(this) );

		if( flags.debug ){
			this._renderWebgl( this._cameras.dev,  0, 0, 1, 1 );
			this._renderWebgl( this._cameras.user,  0, 0, 0.25, 0.25 );
		} else {
			this._renderWebgl( this._cameras.dev,  0, 0, 0.25, 0.25 );
			this._renderWebgl( this._cameras.user,  0, 0, 1, 1 );
		}
	}

	_renderWebgl( camera, left, bottom, width, height ){

		left   *= window.innerWidth;
		bottom *= window.innerHeight;
		width  *= window.innerWidth;
		height *= window.innerHeight;

		this._cameras.dev.updateProjectionMatrix();
		this._cameras.user.updateProjectionMatrix();

		this._renderer.setViewport( left, bottom, width, height );
		this._renderer.setScissor( left, bottom, width, height );
		this._renderer.setScissorTest( true );
		this._renderer.setClearColor( 0x121212 );

		// CONSTANT ANIMATIONS 
		this._scene.rotation.z = Math.sin((counter)-0.5 )*0.2;
		this._scene.rotation.y = Math.sin(counter)*0.1;
		counter += gravityspeed;

		if (skyboxMesh){
			skyboxMesh.rotation.x += 0.0001;
			skyboxMesh.rotation.y += 0.0001;
		}

		if( !flags.debug ){
			this._cameras.user.position.x += ( (mouseX)/20 - this._cameras.user.position.x +10 ) * .002;
			this._cameras.user.position.y += ( ( -mouseY)/40 - this._cameras.user.position.y ) * .004;
			this._cameras.user.lookAt(lookAtVector);
		} 



		this._renderer.render( this._scene, camera );
	}

	_resize( ) {

		this._cameras.dev.aspect  = window.innerWidth / window.innerHeight;
		this._cameras.user.aspect = window.innerWidth / window.innerHeight;

		this._cameras.dev.updateProjectionMatrix()
		this._cameras.user.updateProjectionMatrix()

		this._renderer.setSize( window.innerWidth, window.innerHeight );
	}

	render() {
		return (
			<div>
				<section className="o-page scene6">
					<div className="webgl" ref="webgl"></div>
				</section>
			</div>
		)
	}
}
