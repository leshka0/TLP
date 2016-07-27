import THREE from 'three'

export default function() {

	// Lights
	let controller = {
		 ambient: 0x00000
		,directional: 0xffffff
		,point: 0xcaac83
	}

	let lights = {
		 ambient: new THREE.AmbientLight( controller.ambient )
		,directional: new THREE.DirectionalLight( controller.directional, 0 )
		,point: new THREE.PointLight( controller.point, 0 )
	}

	lights.directional.position.set( -200, -31, -102 )
lights.directional.castShadow = true
lights.directional.shadowDarkness = 0.5;

lights.point.position.set( -665, 1000, -370 )
lights.point.castShadow = true
lights.point.shadowDarkness = 0.3;
lights.point.shadowCameraVisible = true;


	return lights

}
