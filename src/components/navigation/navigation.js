import React, { Component } from 'react'
import { Link } from 'react-router'
import { BASE_URL } from '../../constants/environment'

export default class Navigation extends Component {

	constructor(props) {
		super(props)
	}

	render() {

		const totalScenes = 2
		let scenes = []

		for (var i = 0; i < totalScenes; i++) {
			scenes.push(
				<li key={i}>
					<Link to={`/scene${i}`}>
						Chapter {i}
					</Link>
				</li>
			)
		}

		return (
			<nav className="nav">
				<ul>
					<li>
						<Link to="/home">
							Home
						</Link>
					</li>
					{scenes}
					<li>
						<Link to="/end">
							End
						</Link>
					</li>
				</ul>
			</nav>
		)
	}
}
