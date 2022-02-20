import './App.css';
import Login from './Login';
import Home from './Home';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import { useState } from 'react'
import CreateRoom from './CreateRoom';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <BrowserRouter>
        <header className="App-header">
          <title>My Chat App</title>
          <h1>Welcome to chat room!</h1>
        </header>
        <Switch>
          <Route exact path='/'>
            <Login setUser={ setUser } />
          </Route>
          <Route path='/create'>
            <CreateRoom user={ user } setUser={ setUser }/>
          </Route>
          <Route path='/home'>
            <Home user={ user } setUser={ setUser } />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
