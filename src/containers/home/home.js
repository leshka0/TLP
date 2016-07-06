import React, { Component } from 'react'
import { Link } from 'react-router'
import { BASE_URL } from '../../constants/environment'
import TweenMax from 'gsap'

export default class Home extends Component {

	componentDidMount() {

		TweenMax.to(this.refs.center, 1, {
			delay: 1,
			autoAlpha: 1
		})
	}

	render() {
		return (
			<div>
				<section className="o-page home">
					<div className="center" ref="center">
						<h1>The Little Prince</h1>
						<Link to="/scene1">
							Begin
						</Link>
					</div>
				</section>
			</div>
		)
	}
}
