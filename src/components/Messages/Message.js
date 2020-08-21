import React, { Component } from "react";
import { Comment, Image, Modal, Button, Icon } from "semantic-ui-react";
import moment from "moment";
import firebase from "../firebase";

export default class Message extends Component {
  state = {
    openImg: false,
    user: this.props.message.data.user
  };
  isOnMessage = (user) => {
    return user.id === this.props.user.id ? "message__self" : "";
  };
  timeFromNow = (timestamp) => {
    if (timestamp) {
      return moment(timestamp.toDate()).fromNow();
    } else {
      return "loading ...";
    }
  };
  // timeFromNow = (timestamp) => "date"

  componentDidMount() {
    this.setMsgUser()
 
  }
  setMsgUser = () => {
    let userId = this.props.message.data.user.id;
    if (userId) {
      firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .get()
        .then((doc) => {
          if (doc) {
            // console.log(doc.data());
            this.setState({user: doc.data()})
          }
        });
    }
  };

  openImgModal = () => {
    this.setState({ openImg: true });
  };
  closeImgModal = () => {
    this.setState({ openImg: false });
  };
  render() {
    const { content, timestamp , image } = this.props.message.data;
    const {user} = this.state
    return (
      <Comment>
        <Comment.Avatar src={user.avatar} />
        <Comment.Content className={this.isOnMessage(user)}>
          <Comment.Author as="a"> {user.name} </Comment.Author>
          <Comment.Metadata> {this.timeFromNow(timestamp)} </Comment.Metadata>
          {content ? <Comment.Text> {content} </Comment.Text> : ""}
          {image ? (
            <Image
              src={image}
              className="message__image"
              size="medium"
              rounded
              onClick={this.openImgModal}
            />
          ) : (
            ""
          )}
        </Comment.Content>
        <Modal
          basic
          onClose={this.closeImgModal}
          onOpen={this.openImgModal}
          open={this.state.openImg}
          size="small"
        >
          <Modal.Content>
            <Image src={image} fluid />
          </Modal.Content>
          <Modal.Actions>
            <Button basic color="red" inverted onClick={this.closeImgModal}>
              <Icon name="remove" /> close
            </Button>
          </Modal.Actions>
        </Modal>
      </Comment>
    );
  }
}
