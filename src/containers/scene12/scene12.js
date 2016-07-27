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
var skyvideo = null
var counter = 0
var gravityspeed = 0.0008

export default class Scene12 extends Component {

	constructor(props) {
		super(props)
	}

	componentDidMount() {

		const loader = new AssetLoader.GroupLoader()

		manifest = [
			 
			{id: 'skyvideo', src: `${BASE_URL}/videos/chapter12/sky.webm`, type: 'video'}
			,{id: 'skybox', src: `${BASE_URL}/images/chapter12/skybox.jpg`, type: 'image'}
			,{id: 'planet', src: `${BASE_URL}/dae/chapter12/planet.dae`, type: 'dae'}
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
			sound.transitionIn(12);
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
		function findSkyVideo(video) {
			return video.id === 'skyvideo';
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
		skyvideo.position.set( -14, -90, -331 )
		skyvideo.scale.set( 9, 9 )
		this._scene.add(skyvideo)

		



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
				<section className="o-page scene12">
					<div className="webgl" ref="webgl"></div>
				</section>
			</div>
		)
	}
}
