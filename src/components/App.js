import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PageWrapper from '../components/page-wrapper/page-wrapper'
import Navigation from '../components/navigation/navigation'
import Sounds from '../components/sounds/sounds'
var sound
const DURATION = 1000
//<Sounds />
class App extends Component {

  render() {
    let { pathname } = this.props.location

    return (
      <section>
        <Navigation />
        
        <ReactCSSTransitionGroup
          component={PageWrapper}
          transitionName="example"
          transitionAppear={true}
          transitionAppearTimeout={DURATION}
          transitionEnterTimeout={DURATION * 3}
          transitionLeaveTimeout={DURATION * 2}
        >
          {React.cloneElement(this.props.children || <div />, { key: pathname })}
        </ReactCSSTransitionGroup>
      </section>
    )
  }
}

export default connect(state => ({
	navigationVisible: state.ui.navigationVisibility,
}))(App)
