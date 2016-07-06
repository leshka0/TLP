const Promise = require('es6-promise').Promise

export default class ImageLoader {

	load(asset) {

		return new Promise((resolve, reject) => {

			const image = new Image()

			image.onload = () => {
				asset.data = image
				resolve(asset)
			};

			image.onerror = () => {
				reject(`Failed to load ${asset.src}`)
			}

			image.src = asset.src
		});
	}
}
