import React, { Component } from 'react'
import { Link } from 'react-router'
import Howler from 'howler'
import { BASE_URL } from '../../constants/environment'
var voice
var loop
export default class Sounds extends Component {

	componentDidMount() {
		loop = new Howl({
		  urls: [`${BASE_URL}/sounds/intro/loop.mp3`],
		  loop: true
		}).play();
	 
}

	transitionIn(chapter) {
		// PLAY THE VOICE AFTER THE FADE
		function playVoice(){ 
			 voice = new Howl({
			  urls: [`${BASE_URL}/sounds/chapter`+chapter+`/voice.mp3`],
			  loop: false
			}).play();
		}
		// FADE IN
		loop = new Howl({
		  urls: [`${BASE_URL}/sounds/chapter`+chapter+`/loop.mp3`],
		  loop: true
		}).fadeIn(1, 4000, playVoice);
	}
	transitionOut() {
		loop.fadeOut(0, 6000)
	}



	render() {
		return <div className="sounds"></div>
	}
}
