import THREE from 'three'

export default function() {

	// Lights
	let controller = {
		 ambient: 0xd4d4d4
		,directional: 0xFFFFFF
	}

	let lights = {
		 ambient: new THREE.AmbientLight( controller.ambient )
		,directional: new THREE.DirectionalLight( controller.directional, 0.6 )
	}

	lights.directional.position.set( -10, 3.3, -10 )
	lights.directional.castShadow = true

	return lights

	// let lightFolder = gui.addFolder('lights')
	// lightFolder.open()
	//
	// lightFolder.addColor(controller, 'ambient').onChange(updateLights.bind(this))
	// lightFolder.addColor(controller, 'directional').onChange(updateLights.bind(this))
	// lightFolder.add(lights.directional.position, 'x', -10, 10).name('dir light x')
	// lightFolder.add(lights.directional.position, 'y', -10, 10).name('dir light y')
	// lightFolder.add(lights.directional.position, 'z', -10, 10).name('dir light z')
	//
	// function updateLights(){
	// 	lights.ambient.color.setHex( String(controller.ambient).replace('#', '0x'))
	// 	lights.directional.color.setHex( String(controller.directional).replace('#', '0x'))
	// }
}
