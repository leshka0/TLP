const Promise = require('es6-promise').Promise
import ImageLoader from './image-loader'
import JsonLoader from './json-loader'
import objectAssign from 'object-assign'

export default class GroupLoader{

	constructor() {

		this.defaultLoaders = {
			 'image': ImageLoader
			,'json': JsonLoader
		}
	}

	load( manifest, customLoaders = {} ){

		const loaders = []
		const FileLoaders = objectAssign({}, this.defaultLoaders, customLoaders)

		manifest.forEach( asset => {

			if(FileLoaders[asset.type] !== undefined){
				loaders.push( new FileLoaders[asset.type]().load( asset ) )
			}
		})

		return new Promise( function(resolve, reject) {

			Promise.all(loaders).then( function( response ){

				resolve(response)

			}, function( error ){

				reject(error)
			})
		})
	}
}
