import React, { Component } from "react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

import firebase from "../firebase";

import { Segment, Comment } from "semantic-ui-react";

export default class Messages extends Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    messagesRef: firebase.firestore().collection("messages"),
    privateMessagesRef: firebase.firestore().collection("privateMessages"),
    user: this.props.currentUser,
    channel: this.props.currentChannel,
    messages: [],
    messagesLoading: false,
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
  };

  componentDidMount() {
    const { user, channel } = this.state;
    if (user && channel) {
      this.setState({ messagesLoading: true });
      this.addListeners(channel.id);
    }
  }
  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  };
  addMessageListener = (channelId) => {
    let ref = this.getMessagesRef();
    ref
      .doc(channelId)
      .collection("message")
      .orderBy("timestamp")
      .onSnapshot(
        (chMessages) => {
          let loadedMesages = [];
          chMessages.forEach((doc) => {
            loadedMesages.push({
              id: doc.id,
              data: doc.data(),
            });
          });

          this.setState({ messages: loadedMesages, messagesLoading: false });
          this.scrollMessagesDown();
        },
        (err) => console.log(err)
      );
  };

  messagesEnd = null;
  scrollMessagesDown() {
    if (this.messagesEnd !== null) {
      this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
  }

  displayMessages = (messages) => {
    if (messages.length > 0) {
      return messages.map((message) => {
        return (
          <Message message={message} key={message.id} user={this.state.user} />
        );
      });
    }
  };

  getUniqueUsers = (messages) => {
    let usersIDS = [];
    messages.forEach((msg) => {
      usersIDS.push(msg.data.user.id);
    });
    return +[...new Set(usersIDS)].length;
  };

  handleSearchChange = (event) => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.data.content && message.data.content.match(regex)) ||
        message.data.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 500);
  };

  render() {
    const {
      messagesRef,
      messages,
      searchLoading,
      searchTerm,
      searchResults,
    } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader
          currentChannel={this.props.currentChannel}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          uniqUsersNum={messages.length > 0 ? this.getUniqueUsers(messages) : 0}
          isPrivateChannel={this.props.isPrivateChannel}
        />
        <Segment>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}

            <div
              style={{ width: "100%", height: "1px", marginTop: "auto" }}
              ref={(el) => {
                this.messagesEnd = el;
              }}
            ></div>
          </Comment.Group>
        </Segment>
        <MessageForm
          messagesRef={messagesRef}
          currentChannel={this.props.currentChannel}
          currentUser={this.props.currentUser}
          isPrivateChannel={this.props.isPrivateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    );
  }
}
