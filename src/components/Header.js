import React from "react";
import { pAuth } from "../firebase/config";
import { Link } from "react-router-dom";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false, //don't actually use this in logic, just to change for rerendering
    };
  }

  componentDidMount() {
    pAuth.onAuthStateChanged((user) => {
      if (user) this.setState({ isLoggedIn: true });
      else this.setState({ isLoggedIn: false });
    });
  }

  logout = () => {
    pAuth.signOut().catch((err) => console.log(err));
    this.props.setUser(null);
  };

  changeMenu = () => {
    const menu = document.querySelector("#menu");
    if (menu.style.display == "grid") {
      menu.style.display = "none";
    } else {
      menu.style.display = "grid";
    }
  };

  render() {
    return (
      <div id="header">
        <Link to="/" className="toplink">
          <h1>Syllabase</h1>
        </Link>
        <button type="button" id="menu-button" onClick={this.changeMenu}>
          Menu
        </button>
        <ul id="menu">
          <li>
            <Link to="/personalsyllabi" className="toplink">
              My Syllabi
            </Link>
          </li>
          <li>
            <Link to="/syllabi" className="toplink">
              Browse Syllabi
            </Link>
          </li>
          <li>
            <Link to="/Entities" className="toplink">
              Browse Material
            </Link>
          </li>
          <li>
            <Link id="login-link" to="/login" className="toplink">
              {pAuth.currentUser ? "Profile" : "Login"}
            </Link>
          </li>
          {pAuth.currentUser && (
            <li id="profile-corner">
              <div>{pAuth.currentUser.displayName}</div>
              <button onClick={this.logout}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Header;
