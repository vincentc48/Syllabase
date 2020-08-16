import React, { useState } from "react";
import Home from "./components/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header";
import Login from "./components/Login";
import { pAuth } from "./firebase/config";
import Edit from "./components/Edit";
import Entitieslist from "./components/Entitieslist";
import Syllabilist from "./components/Syllabilist";

function App() {
  const [user, setUser] = useState(
    pAuth.currentUser ? pAuth.currentUser.uid : null
  );
  console.log(pAuth.currentUser);
  return (
    <div className="App">
      <Router>
        <Header user={user} setUser={setUser} />
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/login">
            <Login setUser={setUser} user={user} />
          </Route>
          <Route path="/edit">
            <Edit />
          </Route>
          <Route path="/entities">
            <Entitieslist />
          </Route>
          <Route path="/syllabi">
            <Syllabilist />
          </Route>
          <Route path="/personalsyllabi">
            <Syllabilist
              user={pAuth.currentUser ? pAuth.currentUser.uid : null}
            />
          </Route>
        </Switch>
        <footer id="footer">
          <div>
            <span>Copyright &#169; Syllabase 2020</span>
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;
