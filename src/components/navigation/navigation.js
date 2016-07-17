import React, { Component } from 'react'
import { Link } from 'react-router'
import { BASE_URL } from '../../constants/environment'

export default class Navigation extends Component {

	constructor(props) {
		super(props)
	}

	render() {

		const totalScenes = 17
		let scenes = []

		for (var i = 0; i < totalScenes; i++) {
			scenes.push(
				<li key={i}>
					<Link to={`/scene${i}`}>
						
						{i}
					</Link>
				</li>
			)
		}

		return (
			<nav className="nav">
				<ul>
					<li>
						<Link to="/home">
							Intro
						</Link>
					</li>
					{scenes}
					<li>
						<Link to="/end">
							Outro
						</Link>
					</li>
				</ul>
			</nav>
		)
	}
}
