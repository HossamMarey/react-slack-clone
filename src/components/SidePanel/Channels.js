import React, { Component } from "react";
import { connect } from "react-redux";

import firebase from "../firebase";
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label,
} from "semantic-ui-react";
import { setCurrentChannel, setPrivateChannel } from "../../Actions/index";

class Channels extends Component {
  db = firebase.firestore();

  state = {
    channels: [],
    activeChannel: "",
    channelName: "",
    channelDetails: "",
    modal: false,
    firstLoad: true,
    messagesRef: firebase.firestore().collection("messages"),
    channel: null,
    notifications: [],
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
            this.addNotificationsListener(doc.data().id);
          });
        }
      });
    this.setState({ channels }, () => {
      this.setFirstChannel();
    });
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.clearNotifications();
    }
    this.setState({
      firstLoad: false,
      activeChannel: firstChannel.id,
      channel: firstChannel,
    });
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

  changeChannel = (channel) => {
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ activeChannel: channel.id, channel: channel });
    this.clearNotifications();
  };

  isChannelActive = (channel) => {
    if (!this.props.isPrivateChannel) {
      return channel.id === this.state.activeChannel ? true : false;
    } else {
      return false;
    }
  };
  displayChannels = (channels) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={this.isChannelActive(channel)}
      >
        # {channel.name}
        {this.checkNotifications(channel)}
      </Menu.Item>
    ));

  clearNotifications = () => {
    let index = this.state.notifications.findIndex((notification) => {
      return notification.id === this.state.channel.id;
    });
    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnowenTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };
  checkNotifications = (channel) => {
    let index = this.state.notifications.findIndex((notification) => {
      return notification.id === this.state.channel.id;
    });
    let countNum = 0;
    if (index !== -1) {
      countNum = this.state.notifications[index].count;
    }
    if (countNum > 0) {
      return (
        <Label color="red" size="mini">
          2
        </Label>
      );
    }
  };
  addNotificationsListener = async (channelId) => {
    // console.log(channelId);

    await this.state.messagesRef
      .doc(channelId)
      .collection("message")
      .onSnapshot((snap) => {
        let msgNum = snap.docs.length;

        this.handleNotifications(
          channelId,
          this.state.channel.id,
          this.state.notifications,
          msgNum
        );
      });
    if (this.state.channel) {
    }
  };
  handleNotifications = (
    channelId,
    currentChannelId,
    notifications,
    snapNum
  ) => {
    let lastTotal = 0;
    let index = notifications.findIndex((notification) => {
      return notification.id === channelId;
    });
    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;
        if (snapNum - lastTotal > 0) {
          notifications[index].count = snapNum - lastTotal;
        }
      }
      notifications[index].lastKnowenTotal = snapNum;
    } else {
      notifications.push({
        id: channelId,
        total: snapNum,
        lastKnowenTotal: snapNum,
        count: 0,
      });
    }
    this.setState({ notifications });
  };

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
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

const mapStateToProps = (state) => ({
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
});
export default connect(mapStateToProps, {
  setCurrentChannel,
  setPrivateChannel,
})(Channels);
