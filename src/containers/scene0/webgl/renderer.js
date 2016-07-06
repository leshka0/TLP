import THREE from 'three'

export default function() {
	const renderer = new THREE.WebGLRenderer({ antialias: true })

	renderer.setPixelRatio( window.devicePixelRatio )
	renderer.setSize( window.innerWidth, window.innerHeight )

	return renderer
}
