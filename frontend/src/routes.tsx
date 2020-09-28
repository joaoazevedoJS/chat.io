import React from 'react'

import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'

import Login from './pages/Login/Login'
import Chatio from './pages/Chatio/Chatio'

const Router = function() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/chatio" exact component={Chatio} />
        <Redirect path="*" to="/" />
      </Switch>
    </HashRouter>
  )
}

export default Router