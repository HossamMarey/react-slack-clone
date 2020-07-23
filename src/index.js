import React, { Component } from "react";
import ReactDOM from "react-dom";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";

import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

import firebase from "./components/firebase";
import rootReducer from "./reducers/index";

import { setUser, clearUser } from "./Actions/index";

import "semantic-ui-css/semantic.min.css";
import registerServiceWorker from "./registerServiceWorker";

import App from "./components/App";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import { Loader, Dimmer } from "semantic-ui-react";

class Root extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push("/");
      } else {
        this.props.clearUser()
        this.props.history.push("/login");
        // clear user
      }
    });
  }

  render() {
    return this.props.isLoading ? (
      <Dimmer active>
      <Loader active inline="centered" className="mt-50vh" size="huge" content="loading chat ..." /> </Dimmer>
    ) : (
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoading: state.user.isLoading,
});

const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root));

ReactDOM.render(
  <Provider store={createStore(rootReducer, composeWithDevTools())}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
