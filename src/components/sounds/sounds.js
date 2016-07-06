import React, { Component } from 'react'
import { Link } from 'react-router'
import Howler from 'howler'
import { BASE_URL } from '../../constants/environment'

export default class Sounds extends Component {

	componentDidMount() {

		var sound = new Howl({
		  urls: [`${BASE_URL}/sounds/background.mp3`],
		  loop: true
		}).play();
	}

	render() {
		return <div className="sounds"></div>
	}
}
