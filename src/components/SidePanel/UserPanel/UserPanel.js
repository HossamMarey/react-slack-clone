import React, { Component } from "react";
import firebase from "../../firebase";

import { Grid, Header, Icon, Dropdown } from "semantic-ui-react";

export default class UserPanel extends Component {
  dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          {" "}
          Signed In as <strong>USER</strong>{" "}
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
      .then(() => {
        
      })
      .catch((err) => console.log(err));
  };
  render() {
    return (
      <Grid style={{ background: "#4c3c4c" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: "0" }}>
            {/* app header  */}
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>HossChat</Header.Content>
            </Header>
          </Grid.Row>
          {/* user Dropdown   */}
          <Header style={{ padding: ".25em" }} as="h4" inverted>
            <Dropdown
              trigger={<span>User</span>}
              options={this.dropdownOptions()}
            />
          </Header>
        </Grid.Column>
      </Grid>
    );
  }
}
