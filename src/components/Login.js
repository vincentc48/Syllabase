import React from "react";
import { pAuth, pFirestore } from "../firebase/config";
import Createentity from "./Createentity";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      error: null,
      errorRegister: null,
      pre: "",
    };
  }

  updateState = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, error: null });
  };

  updateUsername = async (usernameParam) => {
    try {
      await pAuth.currentUser.updateProfile({
        displayName: this.state.username,
      });
      await pFirestore
        .collection("users")
        .doc(pAuth.currentUser.uid)
        .set({ username: this.state.username });
      this.forceUpdate();
    } catch (err) {
      console.log(err);
    }
  };

  login = (usernameParam) => {
    console.log(this.state.email, this.state.password);
    pAuth
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        if (usernameParam) {
          pAuth.currentUser
            .updateProfile({ displayName: this.state.username })
            .then(() => {
              //returns a promise, after then execute setUser()
              this.props.setUser(pAuth.currentUser.uid);
              //doesn't matter if these two things execute at the same time
              pFirestore
                .collection("users")
                .doc(pAuth.currentUser.uid)
                .set({ username: this.state.username });
            })
            .catch((err) => this.setState({ errorRegister: err.message }));
        } else {
          this.props.setUser(pAuth.currentUser.uid);
        }
      })
      .catch((err) => this.setState({ error: err.message }));
  };

  register = async (usernameParam) => {
    console.log(this.state.email, this.state.password);
    pAuth
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.login(usernameParam);
      })
      .catch((err) => this.setState({ error: err.message }));
  };

  updateCredentials = (event) => {};

  passwordResetEmail = () => {
    pAuth
      .sendPasswordResetEmail(pAuth.currentUser.email)
      .then(() => {
        this.setState({ pre: "Password Reset Email Sent" });
        setTimeout(() => this.setState({ pre: "" }), 2000);
      })
      .catch((err) => {
        this.setState({ pre: err.message });
        setTimeout(() => this.setState({ pre: "" }), 2000);
      });
  };

  render() {
    if (pAuth.currentUser) {
      return (
        <div id="profile-page">
          <Createentity />
          <div id="update-profile">
            <h3>Profile Settings</h3>
            <form>
              <input
                type="text"
                onChange={this.updateState}
                placeholder="New Username"
                name="username"
              ></input>
              <button type="button" onClick={this.updateUsername}>
                Change Username
              </button>
              <button type="button" onClick={this.passwordResetEmail}>
                Reset Password
              </button>
              <div className="password-reset-email">{this.state.pre}</div>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div id="forms">
          <form id="login-form">
            <h3>Login</h3>
            <input
              placeholder="Email"
              type="text"
              name="email"
              className="email-input"
              onChange={this.updateState}
            ></input>
            <input
              placeholder="Password"
              type="password"
              name="password"
              className="password-input"
              onChange={this.updateState}
            ></input>
            {this.state.error && <div>{this.state.error}</div>}
            <button type="button" onClick={() => this.login(null)}>
              Log in
            </button>
          </form>

          <form id="register-form">
            <h3> Register</h3>
            <input
              placeholder="Username"
              type="text"
              name="username"
              className="username-input"
              onChange={this.updateState}
            ></input>
            <input
              placeholder="Email"
              type="text"
              name="email"
              className="email-input"
              onChange={this.updateState}
            ></input>
            <input
              placeholder="Password"
              type="password"
              name="password"
              className="password-input"
              onChange={this.updateState}
            ></input>
            {this.state.error && <div>{this.state.errorRegister}</div>}
            <button
              type="button"
              onClick={() => this.register(this.state.username)}
            >
              Register
            </button>
          </form>
        </div>
      );
    }
  }
}

export default Login;
