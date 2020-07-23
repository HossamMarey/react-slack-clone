import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase";

import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";

export default class Login extends Component {
  state = {
    email: "",
    password: "",
    errors: [],
    loading: false,
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  isFormEmpty = ({ email, password }) => {
    return !email.length || !password.length;
  };
  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password < 6 || passwordConfirmation < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if (this.isFormEmpty(this.state)) {
      // err
      error = { message: "Fill in all fields" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      // valid
      return true;
    }
  };

  displayErrors = (errors) =>
    errors.map((err, i) => <p key={i}>{err.message}</p>);

  handleInputErr = (errors, inputType) => {
    return errors.some((err) => err.message.toLowerCase().includes(inputType))
      ? "error"
      : "";
  };
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.isFormValid()) {
      this.setState({ loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((dd) => {
          this.setState({errors: [],loading: false})
          console.log(dd);
        })
        .catch((err) => {
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false,
          });
        });
    }
  };

  render() {
    const { email, password, errors, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="violet" textAlign="center">
            <Icon name="code branch" color="violet"></Icon>
            Login
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="email"
                type="email "
                onChange={this.handleChange}
                value={email}
                className={this.handleInputErr(errors, "email")}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="password"
                type="password"
                onChange={this.handleChange}
                value={password}
                className={this.handleInputErr(errors, "password")}
              />

              <Button
                color="violet"
                fluid
                size="large"
                className={loading ? "loading" : ""}
                disabled={loading}
              >
                Login
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3> Errors </h3>
              {this.displayErrors(errors)}
            </Message>
          )}

          <Message>
            New user ? <Link to="/register">Register</Link>{" "}
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
