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
var skyboxMesh
var lensFlare
var skyvideo = null
var counter = 0
var gravityspeed = 0.0008

export default class Scene7 extends Component {

	constructor(props) {
		super(props)
	}

	componentDidMount() {

		const loader = new AssetLoader.GroupLoader()

		manifest = [
			{id: 'skybox', src: `${BASE_URL}/images/chapter7/skybox.jpg`, type: 'image'}
			,{id: 'skyvideo', src: `${BASE_URL}/videos/chapter7/sky.webm`, type: 'video'}
			,{id: 'thorn', src: `${BASE_URL}/dae/chapter7/thorn.dae`, type: 'dae'}
			,{id: 'textureFlare0', src: `${BASE_URL}/videos/chapter7/lensflare0.mp4`, type: 'video'}
			,{id: 'textureFlare1', src: `${BASE_URL}/images/chapter7/lensflare/lensflare1.png`, type: 'image'}
			,{id: 'textureFlare2', src: `${BASE_URL}/images/chapter7/lensflare/lensflare2.png`, type: 'image'}
			,{id: 'textureFlare3', src: `${BASE_URL}/images/chapter7/lensflare/lensflare3.png`, type: 'image'}
			,{id: 'textureFlare4', src: `${BASE_URL}/images/chapter7/lensflare/lensflare4.png`, type: 'image'}
			,{id: 'textureFlare5', src: `${BASE_URL}/images/chapter7/lensflare/lensflare5.png`, type: 'image'}
			,{id: 'textureFlare6', src: `${BASE_URL}/images/chapter7/lensflare/lensflare6.png`, type: 'image'}
			,{id: 'textureFlare7', src: `${BASE_URL}/images/chapter7/lensflare/lensflare7.png`, type: 'image'}
			,{id: 'textureFlare8', src: `${BASE_URL}/images/chapter7/lensflare/lensflare8.png`, type: 'image'}
			,{id: 'textureFlare9', src: `${BASE_URL}/images/chapter7/lensflare/lensflare9.png`, type: 'image'}

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
			sound.transitionIn(7);
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
		function findDae(dae) {
			return dae.id === 'thorn';
		}
		function findSkyVideo(video) {
			return video.id === 'skyvideo';
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
		var reflectionCube = new THREE.CubeTextureLoader().load( urls );
		reflectionCube.format = THREE.RGBFormat;

		var shader = THREE.ShaderLib[ "cube" ];
		var skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 1000, 1000, 1000 ), skyMaterial ); 
		this._scene.add(skyboxMesh); 

		// SKY VIDEO

		const textureSky1 = document.createElement( 'video' );

		textureSky1.src = manifest.find(findSkyVideo).src;
		textureSky1.loop = true; // must call after setting/changing source
		textureSky1.play();
		var videoSky = document.createElement( 'canvas' );
		videoSky.width = 512;
		videoSky.height = 512;

		var videoSkyContext = videoSky.getContext( '2d' );
		
		const textureSky = new THREE.Texture( videoSky );

		TweenLite.ticker.addEventListener("tick", function(){
			videoSkyContext.clearRect(0, 0, 512, 512);
			videoSkyContext.drawImage(textureSky1, 0, 0, 512, 512);
			textureSky.needsUpdate = true;
		});



		skyvideo = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({
			map: textureSky,
			emissive: 0xffffff,
			emissiveMap: textureSky,
			side: THREE.DoubleSide,
			color: 0xFFFFFF,
			transparent: true
		}))
		skyvideo.position.set( 0, -150, 0 )
		skyvideo.scale.set( 8, 8 )
		skyvideo.rotation.set( Math.PI/2, 0, 0 )
		this._scene.add(skyvideo)

		// COLALDA
		var thorns = 60
		var child = this;
		var daeurl = manifest.find(findDae).src;
		var thornInterval = setInterval(function(){ growThorn() }, 5000);
		function thornStopFunction() {
		    clearInterval(thornInterval);
		}

		function growThorn() {
			thorns --
			if (thorns<0){
				thornStopFunction()
			}		
			//OBJECT LOADER
			var dae_geometry;
			var dae_material; 
			var loader = new THREE.ColladaLoader();
			loader.options.convertUpAxis = true;
			loader.load( daeurl, function ( collada ) {
			
				var dae = collada.scene;
	
				dae_material = new THREE.MeshPhongMaterial( { envMap: reflectionCube, color: 0xffffff, reflectivity: 0.2 } );
	
				dae.scale.x = dae.scale.y = dae.scale.z = 1;
				dae.position.y = -500;
				dae.updateMatrix();
				var random = Math.random()*Math.PI*2
				dae.position.x = Math.cos(random)*150;
				dae.position.z = Math.sin(random)*150;
				dae.rotation.y = Math.sin(random)*360;
				child._scene.add( dae );

				TweenMax.to(dae.position, 15, {y:0})
				TweenMax.to(dae.rotation, 15, {y:Math.sin(random)*380})
			
			
			} );
		}
		

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

			
			TweenMax.to(this._lights.directional, 25, {intensity:0.6})
			TweenMax.to(this._lights.point, 25, {intensity:0.6})
			// ----------- TO DO ---------------- // 
			TweenMax.to(lensFlare, 8, {color:0xFF3322})
		

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
			lensFlare.position.x = this._lights.directional.position.x;
			lensFlare.position.y = this._lights.directional.position.y;
			lensFlare.position.z = this._lights.directional.position.z;
		}
		

		if( !flags.debug ){
			this._cameras.user.rotation.x += ( ( -mouseY)/1500 - this._cameras.user.rotation.x ) * .004;
			this._cameras.user.rotation.y -= ( ( mouseX)/250000);
		} 	
			this._lights.directional.intensity = Math.sin((this._cameras.user.rotation.y+0.7))/2 +0.5



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
				<section className="o-page scene7">
					<div className="webgl" ref="webgl"></div>
				</section>
			</div>
		)
	}
}
