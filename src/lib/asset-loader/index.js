import GroupLoader from './group-loader'
import ImageLoader from './image-loader'
import JsonLoader from './json-loader'

module.exports = {
	GroupLoader: GroupLoader,
	ImageLoader: ImageLoader,
	JsonLoader: JsonLoader,
}

window.AssetLoader = {}

for(const cls in module.exports){
	window.AssetLoader[cls] = module.exports[cls]
}
