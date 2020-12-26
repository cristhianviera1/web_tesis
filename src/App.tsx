import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {PrivateRoute} from './components/_helpers/PrivateRoute';
import './App.css';

import Login from './pages/Login';
import Layout from './components/LayoutView';

class App extends Component {
    render() {
        return <Router>
            <Route path="/" exact component={Login}/>
            <PrivateRoute path="/administrator" component={Layout}/>
        </Router>
    }
}

export default App;
