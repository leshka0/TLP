import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import createLogger from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'
import promiseMiddleware from 'redux-promise-middleware'
import { USE_DEV_TOOLS } from '../constants/environment'

export default function configureStore(options = {}) {
	const {
		initialState = {},
		browserHistory = {},
	} = options

	const middlewares = []

	middlewares.push(
		promiseMiddleware({
			promiseTypeSuffixes: ['START', 'SUCCESS', 'ERROR'],
		}),
		thunk,
		routerMiddleware(browserHistory),
	);

	if (USE_DEV_TOOLS) {
		middlewares.push(createLogger())
	}

	const createReduxStore = (USE_DEV_TOOLS && window.devToolsExtension)
		? compose(applyMiddleware(...middlewares), window.devToolsExtension())
		: compose(applyMiddleware(...middlewares))

	const store = createReduxStore(createStore)(rootReducer, initialState)

	return store;
}
