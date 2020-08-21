import React, { Component } from "react";
import { connect } from "react-redux";

import { setCurrentChannel, setPrivateChannel } from "./../../Actions/index";

import firebase from "../firebase";
import { Menu, Icon } from "semantic-ui-react";

class DirectMessages extends Component {
  state = {
    user: this.props.currentUser,
    users: [],
    channel: this.props.currentChannel,
    activeId: null,
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
      // this.updateStatus(this.state.user.uid);
    }
  }

  addListeners = (currentUserId) => {
    let loadedUsers = [];
    firebase
      .firestore()
      .collection("users")
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().uid !== currentUserId) {
            let user = doc.data();
            user["ststus"] = "offline";
            loadedUsers.push(user);
          }
        });
        this.setState({ users: loadedUsers });
        // console.log(this.state.users);
      });
  };
  updateStatus = async (currentUserId) => {
    // firebase
    //   .firestore()
    //   .collection("usersstatus")
    //   .doc(currentUserId)
    //   .onSnapshot((snap) => {
    //     console.log(snap);
    //     snap.ref.set({ status: "online" });
    //   });
    //disconnect fn
    // disconnect()
  };

  changeChannel = (user) => {
    const channelId = this.getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name,
    };
    this.setState({ activeId: channelId });
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
  };
  getChannelId = (uid) => {
    const currentUserId = this.state.user.uid;
    return uid > currentUserId
      ? `${uid}-${currentUserId}`
      : `${currentUserId}-${uid}`;
  };

  isChannelActive = (user) => {
    let chId = this.state.activeId;
    let userId = user.uid;
    let id1;
    let id2;
    if (!this.props.isPrivateChannel) {
      return false;
    }
    if (chId) {
      if (chId.includes("-")) {
        id1 = chId.split("-")[0];
        id2 = chId.split("-")[1];
      }
    } else {
      return false;
    }
    if (userId === id1 || userId === id2) {
      return true;
    } else {
      return false;
    }
  };
  render() {
    const { users } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="mail" /> DIRECT MESSAGES
            </span>{" "}
            ({users.length})
          </Menu.Item>
          {users.map((user) => (
            <Menu.Item
              key={user.uid}
              onClick={() => this.changeChannel(user)}
              style={{ fontStyle: "italic", opacity: 0.7 }}
              active={this.isChannelActive(user)}
            >
              <span>
                <Icon name="user" size="small" />{" "}
              </span>
              {user.name}
            </Menu.Item>
          ))}
        </Menu.Menu>
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
})(DirectMessages);
