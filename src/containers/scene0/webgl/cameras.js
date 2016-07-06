import THREE from 'three'

export default function() {
	return {
		dev: new THREE.PerspectiveCamera( 65, Screen.width / window.innerHeight, 0.1, 100000 ),
		user: new THREE.PerspectiveCamera( 65, Screen.width / window.innerHeight, 0.1, 100000 )
	}
}
