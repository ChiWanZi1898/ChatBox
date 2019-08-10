import React from 'react';
import {Link, Route, Switch } from 'react-router-dom';
import Register from './Register.jsx'

function App() {
  return (
      <div>
          <ul>
              <li><Link to="register">Register</Link></li>
          </ul>
          <Switch>
              <Route path="/register" component={Register}/>
          </Switch>
      </div>

  )
}

export default App;
