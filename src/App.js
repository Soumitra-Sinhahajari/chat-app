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
        {/* <h1>Welcome to chat room!</h1> */}
        <Switch>
          <Route exact path='/'>
            <div class="login">
              <Login setUser={ setUser } />
            </div>
            </Route>
          <Route path='/home'>
            <div class="home">
              {user && (<Home user={ user } setUser={ setUser } />)}
            </div>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
