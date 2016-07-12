import THREE from 'three'

export default function() {

	// Lights
	let controller = {
		 ambient: 0x000000
		,directional: 0xfffff2
		,point: 0xd4e6ff
	}

	let lights = {
		 ambient: new THREE.AmbientLight( controller.ambient )
		,directional: new THREE.DirectionalLight( controller.directional, 0 )
		,point: new THREE.PointLight( controller.point, 0 )
	}

	lights.directional.position.set( 135, 200, -80)
	//lights.directional.castShadow = true
	//lights.directional.shadowDarkness = 0.5;
	
	lights.point.position.set( 0, 250, -370 )
	//lights.point.castShadow = true
	//lights.point.shadowDarkness = 0.3;
	//lights.point.shadowCameraVisible = true;

	return lights

}
