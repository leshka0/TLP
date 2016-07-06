import React, { Component } from 'react'
import { Link } from 'react-router'

export default class End extends Component {

	componentDidMount() {

		TweenMax.to(this.refs.center, 1, {
			delay: 1,
			autoAlpha: 1
		})
	}

	render() {
		return (
			<div>
				<section className="o-page end">
					<div className="center" ref="center">
						<h1>Credits</h1>
						<Link to="/home">
							Start over
						</Link>
					</div>
				</section>
			</div>
		)
	}
}
