import React from 'react'

import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'

import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'

const Router = function() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/chatio" exact component={Chat} />
        <Redirect path="*" to="/" />
      </Switch>
    </HashRouter>
  )
}

export default Router