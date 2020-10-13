import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Layout from './components/LayoutView';

class App extends Component {
  render() {
    return <Router>
        <Route path="/" exact component={Login}/>
        <Route path="/administrator" component={Layout}/>
    </Router>
  }
}

export default App;
