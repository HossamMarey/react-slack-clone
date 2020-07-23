import React, { Component } from "react";

import firebase from "../firebase";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";

export default class Channels extends Component {
  db = firebase.firestore();

  state = {
    channels: [],
    channelName: "",
    channelDetails: "",
    modal: false,
  };

  componentDidMount() {
    this.addListener();
  }

  openModel = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel(this.state, this.props.currentUser);
    }
  };
  addListener = async () => {
    let channels = [];
    await this.db
      .collection("channels")
      .get()
      .then((docs) => {
        if (docs) {
          docs.forEach((doc) => {
            channels.push(doc.data());
          });
        }
      });
    this.setState({ channels });
  };

  addChannel = ({ channelName, channelDetails }, user) => {
    this.db
      .collection("channels")
      .add({
        name: channelName,
        details: channelDetails,
        createdBy: {
          uid: user.uid,
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
      })
      .then((data) => {
        data.update({ id: data.id }).then(() => {
          this.addListener();
          this.closeModal();
        });
      })
      .catch((err) => console.log(err));
  };

  displayChannels = (channels) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => console.log(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
      >
        # {channel.name}
      </Menu.Item>
    ));
  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: "2em" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>
            &nbsp; ({channels.length}){" "}
            <Icon
              name="add"
              onClick={this.openModel}
              style={{ cursor: "pointer" }}
            />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>
        {/* modal  */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  name="channelName"
                  label="name of channel"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  name="channelDetails"
                  label="About the channel"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              {" "}
              <Icon name="checkmark" /> Add{" "}
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              {" "}
              <Icon name="remove" /> Cancel{" "}
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}
