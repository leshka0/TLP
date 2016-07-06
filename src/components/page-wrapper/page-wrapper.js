import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class PageWrapper extends Component {

  static propTypes = {
	children: PropTypes.any,
  }

  render() {
    const { children } = this.props
    return (
      <div ref="wrapper">
		  {children}
      </div>
    )
  }
}

export default connect(state => ({}))(PageWrapper)
