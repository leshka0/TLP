const Promise = require('es6-promise').Promise

export default class JsonLoader {

	load(asset) {

		return new Promise((resolve, reject) => {

			const req = new XMLHttpRequest()

			req.onreadystatechange = function() {

				if (req.readyState != 4) return

				if (req.readyState == 4 && req.status == 200) {
					asset.data = JSON.parse(req.responseText)
					resolve(asset)
				}
				else {
					reject(`Failed to load ${asset.src}`)
				}
			}

			req.open('GET', asset.src, true)
			req.send()
		})
	}
}
