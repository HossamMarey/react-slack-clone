import React, { Component } from "react";
import { Comment, Image, Modal, Button, Icon } from "semantic-ui-react";
import moment from "moment";

export default class Message extends Component {
  state = {
    openImg: false,
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

  openImgModal = () => { this.setState({openImg: true})}
  closeImgModal = () => { this.setState({openImg: false})}
  render() {
    const { content, timestamp, user, image } = this.props.message.data;
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
