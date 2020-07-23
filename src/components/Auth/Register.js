import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import md5 from "md5";

import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";

export default class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
  };
 
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
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
    } else if (!this.isPasswordValid(this.state)) {
      //err

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
    this.setState({ errors: [], loading: true });
    if (this.isFormValid()) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          

          createdUser.user.updateProfile({
              displayName: this.state.username,
              photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`,
            })
            .then(() => {
              this.setState({ loading: false });
              this.saveUser(createdUser).then(() => {
                console.log("user saved")
              })
            })
            .catch((err) => {
              console.log(err);
              let error = { message: err.message };
              this.setState({
                errors: [...this.state.errors, error],
                loading: false,
              });
            });


        })
        .catch((err) => {
          console.log(err);
          let error = { message: err.message };
          this.setState({
            errors: [...this.state.errors, error],
            loading: false,
          });
        });
    } else {
      this.setState({ loading: false });
    }
  };

  saveUser = async (createdUser) => {
   await firebase.firestore().collection("users").add({
      name: createdUser.user.displayName,
      avatar : createdUser.user.photoURL,
      email: createdUser.user.email,
      uid: createdUser.user.uid
    }).then( dd => console.log(dd)).catch(err => console.log(err))
    
  }

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading,
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange"></Icon>
            Register for chat
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="username"
                type="text "
                onChange={this.handleChange}
                value={username}
              />
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
              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="confirm password"
                type="password"
                onChange={this.handleChange}
                value={passwordConfirmation}
                className={this.handleInputErr(errors, "password")}
              />

              <Button
                color="orange"
                fluid
                size="large"
                className={loading ? "loading" : ""}
                disabled={loading}
              >
                Submit
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
            ALready a user ? <Link to="/login">Login</Link>{" "}
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}
