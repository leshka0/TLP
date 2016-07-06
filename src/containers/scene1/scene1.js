import React, { Component } from 'react'
import { Link } from 'react-router'
import { BASE_URL } from '../../constants/environment'
import THREE from 'three'
import * as flags from './webgl/flags';
import {GroupLoader} from '../../lib/asset-loader/index'

import lights from './webgl/lights'
import cameras from './webgl/cameras'
import renderer from './webgl/renderer'
import scene from './webgl/scene'
const OrbitControls = require('three-orbit-controls')(THREE)

export default class Scene1 extends Component {

	constructor(props) {
		super(props)
	}

	componentDidMount() {

		const loader = new AssetLoader.GroupLoader()

		const manifest = [
			 {id: 'image', src: `${BASE_URL}/images/image.png`, type: 'image'}
			,{id: 'json', src: `${BASE_URL}/json/data.json`, type: 'json'}
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

		this._cancelRAF = true

		this._scene = null
		this._cameras = null

		this._renderer.domElement.removeEventListener('dblclick', null, false)
		this._renderer.domElement = null

		window.removeEventListener('resize', this._onResizeHandler)

		this._controls.dispose()
	}

	_initWebgl() {

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
		camera.position.set( 1 * zoom, 0.75 * zoom, 1 * zoom );
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
				<section className="o-page scene1">
					<div className="webgl" ref="webgl"></div>
				</section>
			</div>
		)
	}
}
