import React, { Component } from "react";
// import { connect } from "react-redux";

import firebase from "../../firebase";

import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
  };
  componentDidMount() {
    // console.log(this.props.currentUser);
    // this.setState({user: this.props.currentUser})
  }

  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          {" "}
          Signed In as <strong>{this.state.user.name}</strong>{" "}
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span> change avatar </span>,
    },
    {
      key: "signout",
      text: <span onClick={this.handleSignout}> Sign Out </span>,
    },
  ];
  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {})
      .catch((err) => console.log(err));
  };

  render() {
    const { user } = this.state;
    return (
      <Grid style={{ background: "#4c3c4c" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: "0" }}>
            {/* app header  */}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>HossChat</Header.Content>
            </Header>
          {/* user Dropdown   */}
          <Header style={{ padding: ".25em" }} as="h4" inverted>
            <Dropdown
              trigger={
                <span>
                  <Image src={user.avatar} spaced="right" avatar />
                  {user.name}
                </span>
              }
              options={this.dropdownOptions()}
            />
          </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

// const mapStateToProps = (state) => ({
//   currentUser: state.user.currentUser,
// });

export default UserPanel;
// export default  connect(mapStateToProps)(UserPanel);
