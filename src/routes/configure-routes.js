import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from '../components/app'
import Home from '../containers/home/home';
import End from '../containers/end/end';
import Scene0 from '../containers/scene0/scene0'
import Scene1 from '../containers/scene1/scene1'
import Scene16 from '../containers/scene16/scene16'
import Scene6 from '../containers/scene6/scene6'

export default function configureRoutes() {
	return (
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path="/scene0" component={Scene0} />
			<Route path="/scene1" component={Scene1} />
			<Route path="/scene6" component={Scene6} />
			<Route path="/scene16" component={Scene16} />
			<Route path="/end" component={End} />
			<Route path="*" component={Home} />
		</Route>
	)
}
