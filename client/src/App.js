import React from 'react';
import {Link, Route, Switch } from 'react-router-dom';
import Register from './Register'
import Login from './Login'
import Messages from './Messages'
import Logout from './Logout'

function App() {
  return (
      <div>
          <ul>
              <li><Link to="register">Register</Link></li>
              <li><Link to="login">Login</Link></li>
              <li><Link to="messages">Messages</Link></li>
              <li><Logout/></li>
          </ul>
          <Switch>
              <Route path="/register" component={Register}/>
              <Route path="/login" component={Login}/>
              <Route path="/messages" component={Messages}/>
          </Switch>
      </div>

  )
}

export default App;
