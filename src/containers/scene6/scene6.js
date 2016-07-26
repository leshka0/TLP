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


var collada = require('three-loaders-collada')(THREE);
//this.loader = new THREE.ColladaLoader();

const OrbitControls = require('three-orbit-controls')(THREE)
var manifest
var sound

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
var lensFlare
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
			,{id: 'planet', src: `${BASE_URL}/dae/chapter6/planet.dae`, type: 'dae'}
			,{id: 'textureFlare0', src: `${BASE_URL}/videos/chapter6/lensflare0.mp4`, type: 'video'}
			,{id: 'textureFlare1', src: `${BASE_URL}/images/chapter6/lensflare/lensflare1.png`, type: 'image'}
			,{id: 'textureFlare2', src: `${BASE_URL}/images/chapter6/lensflare/lensflare2.png`, type: 'image'}
			,{id: 'textureFlare3', src: `${BASE_URL}/images/chapter6/lensflare/lensflare3.png`, type: 'image'}
			,{id: 'textureFlare4', src: `${BASE_URL}/images/chapter6/lensflare/lensflare4.png`, type: 'image'}
			,{id: 'textureFlare5', src: `${BASE_URL}/images/chapter6/lensflare/lensflare5.png`, type: 'image'}
			,{id: 'textureFlare6', src: `${BASE_URL}/images/chapter6/lensflare/lensflare6.png`, type: 'image'}
			,{id: 'textureFlare7', src: `${BASE_URL}/images/chapter6/lensflare/lensflare7.png`, type: 'image'}
			,{id: 'textureFlare8', src: `${BASE_URL}/images/chapter6/lensflare/lensflare8.png`, type: 'image'}
			,{id: 'textureFlare9', src: `${BASE_URL}/images/chapter6/lensflare/lensflare9.png`, type: 'image'}

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

		//console.log(window.Howler)
		for (var i = window.Howler._howls.length - 1; i >= 0; i--) {
			window.Howler._howls[i].fadeOut(0, 4000);
		}
		if( flags.sound ){
			sound = new Sounds();
			sound.transitionIn(6);
		}
		

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
		function findFlare0(video) {
			return video.id === 'textureFlare0';
		}
		function findFlare1(image) {
			return image.id === 'textureFlare1';
		}
		function findFlare2(image) {
			return image.id === 'textureFlare2';
		}
		function findFlare3(image) {
			return image.id === 'textureFlare3';
		}
		function findFlare4(image) {
			return image.id === 'textureFlare4';
		}
		function findFlare5(image) {
			return image.id === 'textureFlare5';
		}
		function findFlare6(image) {
			return image.id === 'textureFlare6';
		}
		function findFlare7(image) {
			return image.id === 'textureFlare7';
		}
		function findFlare8(image) {
			return image.id === 'textureFlare8';
		}
		function findFlare9(image) {
			return image.id === 'textureFlare9';
		}
		function findVideo(video) {
			return video.id === 'prince';
		}
		function findDae(dae) {
			return dae.id === 'planet';
		}
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

		var shader = THREE.ShaderLib[ "cube" ];
		var skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 1000, 1000, 1000 ), skyMaterial ); 
		this._scene.add(skyboxMesh); 

		// PRINCE
		const texturePrince1 = document.createElement( 'video' );

		texturePrince1.src = manifest.find(findVideo).src;
		texturePrince1.loop = true; // must call after setting/changing source
		texturePrince1.play();
		var videoPrince = document.createElement( 'canvas' );
		videoPrince.width = 512;
		videoPrince.height = 512;

		var videoPrinceContext = videoPrince.getContext( '2d' );
		
		const texturePrince = new THREE.Texture( videoPrince );

		TweenLite.ticker.addEventListener("tick", function(){
			videoPrinceContext.clearRect(0, 0, 512, 512);
			videoPrinceContext.drawImage(texturePrince1, 0, 0, 512, 512);
			texturePrince.needsUpdate = true;
		});
		
		
		var geometry = new THREE.PlaneGeometry(100, 100)
		var material = new THREE.MeshPhongMaterial( {
			map: texturePrince,
			emissive: 0x000000,
			emissiveMap: texturePrince,
			color: 0xFFFFFF,
			transparent: true,
			alphaTest: 0.25
		} )
		var prince = new THREE.Mesh( geometry, material )
		prince.castShadow = false
		prince.receiveShadow = false
		prince.material.needsUpdate = true;
		prince.material.emissive.r = 0.19*100/255;
		prince.material.emissive.g = 0.22*100/255;
		prince.material.emissive.b = 0.41*100/255;
		TweenMax.to(prince.material.emissive, 60, {r: 1, g:1, b:1})
		
		prince.position.set( 0, 17, 0 )
		prince.scale.set( 0.5, 0.5)


		this._scene.add( prince )

		// COLLADA
		var dae;
		var child = this;
		var dae_geometry;
		var dae_material;
		var daeurl = manifest.find(findDae).src;
		var loader = new THREE.ColladaLoader();
		loader.options.convertUpAxis = true;
		loader.load( daeurl, function ( collada ) {
			
			console.log("object loaded")
			dae = collada.scene;

			dae_material = new THREE.MeshPhongMaterial( { color: 0xffffff, reflectivity: 0.2 } );

			dae.scale.x = dae.scale.y = dae.scale.z = .3;
			dae.position.y = -50;
			dae.updateMatrix();
			child._scene.add( dae );
		} );

		// FLARE

			// VIDEO SUN
			
		var sunvideo = document.createElement( 'video' );
		sunvideo.src = manifest.find(findFlare0).src;
		sunvideo.loop = true; // must call after setting/changing source
		sunvideo.play();
		var videoFlare = document.createElement( 'canvas' );
		videoFlare.width = 512;
		videoFlare.height = 512;
	
		var videoFlareContext = videoFlare.getContext( '2d' );
	
		var textureFlare0 = new THREE.Texture( videoFlare );

		TweenLite.ticker.addEventListener("tick", function(){
			videoFlareContext.drawImage(sunvideo, 0, 0, 512, 512);
			textureFlare0.needsUpdate = true;
		});
		

		var textureFlare1 = new THREE.TextureLoader().load( manifest.find(findFlare1).src );
		var textureFlare2 = new THREE.TextureLoader().load( manifest.find(findFlare2).src );
		var textureFlare3 = new THREE.TextureLoader().load( manifest.find(findFlare3).src );
		var textureFlare4 = new THREE.TextureLoader().load( manifest.find(findFlare4).src );
		var textureFlare5 = new THREE.TextureLoader().load( manifest.find(findFlare5).src );
		var textureFlare6 = new THREE.TextureLoader().load( manifest.find(findFlare6).src );
		var textureFlare7 = new THREE.TextureLoader().load( manifest.find(findFlare7).src );
		var textureFlare8 = new THREE.TextureLoader().load( manifest.find(findFlare8).src );
		var textureFlare9 = new THREE.TextureLoader().load( manifest.find(findFlare9).src );
		var flareColor = new THREE.Color( 0xFFFF88 );
		 
		var blendMode = 2;

		lensFlare = new THREE.LensFlare( textureFlare0, 512, 0.0, THREE.AdditiveBlending, flareColor );
		
		lensFlare.add( textureFlare8, 60, 0.4, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare5, 80, 0.6, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare8, 90, 0.7, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare3, 320, 0.13, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare4, 900, 1.0, THREE.AdditiveBlending, flareColor );
		lensFlare.add( textureFlare9, 52, 0.3, THREE.AdditiveBlending, flareColor );
		lensFlare.position.set(-137, 72, -200);
		this._scene.add( lensFlare );

 
		//  --  END  -- //

			this._cameras.user.position.set( 0, 28, 300 );
			this._cameras.dev.position.set( 0, 28, 119 );
			TweenMax.to(this._lights.directional, 25, {intensity:0.6})
			TweenMax.to(this._lights.point, 25, {intensity:0.6})
			TweenMax.to(this._cameras.user.position, 105, {z:119})
		

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
		if (window['lensFlare'] != undefined){
			lensFlare.position.x = lights.directional.position.x;
			lensFlare.position.y = lights.directional.position.y;
			lensFlare.position.z = lights.directional.position.z;
		}
		if (window['prince'] != undefined){
			prince.rotation.y += ( ( mouseX)/2000 - prince.rotation.y ) * .002;
		}

		if( !flags.debug ){
			this._cameras.user.position.x += ( (mouseX)/20 - this._cameras.user.position.x +10 ) * .002;
			this._cameras.user.position.y += ( ( -mouseY)/100 - this._cameras.user.position.y ) * .004;
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
