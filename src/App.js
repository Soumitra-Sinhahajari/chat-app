import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Home from './Home';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { useState } from 'react'
import Room from './Room';

function App() {
  const [UserName, setUserName] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <header className="App-header">
          <title>My Chat App</title>
          <h1>Welcome to chat room!</h1>
        </header>
        <Switch>
          <Route exact path='/'>
            <Login setUserName={ setUserName } />
          </Route>
          <Route path='/roomtest'>
            <Room />
          </Route>
          <Route path='/home'>
            <Home />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
