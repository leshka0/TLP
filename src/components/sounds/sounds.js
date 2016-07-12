import React, { Component } from 'react'
import { Link } from 'react-router'
import Howler from 'howler'
import { BASE_URL } from '../../constants/environment'

export default class Sounds extends Component {

	componentDidMount() {
		var voice
		var loop = new Howl({
		  urls: [`src/assets/sounds/intro/loop.mp3`],
		  loop: true
		}).play();

		// PLAY THE VOICE AFTER THE FADE
		function playVoice(){ 
			 voice = new Howl({
			  urls: [`src/assets/sounds/chapter16/voice.mp3`],
			  loop: false
			}).play();
		}
		// FADE
		loop.fadeOut(0, 4000)
		var loop = new Howl({
		  urls: [`src/assets/sounds/chapter16/loop.mp3`],
		  loop: true
		}).fadeIn(1, 4000, playVoice);
		
		
	}


	render() {
		return <div className="sounds"></div>
	}
}
