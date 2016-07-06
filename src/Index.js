import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import { Provider } from 'react-redux';
import configureStore from './store/configure-store'
import configureRoutes from './routes/configure-routes'
import { syncHistoryWithStore } from 'react-router-redux'
import FastClick from 'fastclick'

const store = configureStore({
	browserHistory
});

const history = syncHistoryWithStore(browserHistory, store)
const routes = configureRoutes()

render(
  (<Provider store={store}>
    <Router
      history={history}
    >
      {routes}
    </Router>
  </Provider>), document.getElementById('content')
)

FastClick(document.body)
