import React, { Component } from "react";
import uuid from "uuid/v4";

import FileModal from "./FileModal";

import { Segment, Button, Input, Form } from "semantic-ui-react";
import firebase from "../firebase";

export default class MessageForm extends Component {
  state = {
    message: "",
    loading: false,
    imgLoading: false,
    channel: this.props.currentChannel,
    errors: [],
    modal: false,
    storageRef: firebase.storage().ref(),
    uploadingState: "",
    uploadTask: null,
    uploadingProgress: 0,
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  sendMessage = () => {
    let ref = this.props.getMessagesRef();
    const { message, channel } = this.state;
    if (message && channel) {
      this.setState({ loading: true });
      ref
        .doc(channel.id)
        .collection("message")
        .add(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "add a message" }),
      });
    }
  };
  createMessage(imgURL = null) {
    this.setState({ loading: true });
    const message = {
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: this.props.currentUser,
    };
    if (imgURL !== null) {
      message["image"] = imgURL;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  }

  getFilePath = () => {
    if (this.props.isPrivateChannel) {
      return `private-${this.state.channel.id}`;
    } else {
      return "public";
    }
  };

  uploadFile = (file, metadata) => {
    const fileType = file.type.split("/")[1];
    const filePath = `chat/${this.getFilePath()}/${uuid()}.${fileType}`;
    this.setState(
      {
        uploadingState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );

            if (percentUploaded < 99) {
              this.setState({ imgLoading: true });
            } else {
              this.setState({ imgLoading: false });
            }
            this.setState({ uploadingProgress: percentUploaded });
          },
          (err) => {
            console.log(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadingState: "error",
              uploadTask: null,
              uploadingProgress: 0,
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadURL) => {
                this.sendFileMessage(downloadURL);
              })
              .catch((err) => {
                console.log(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadingState: "error",
                  uploadTask: null,
                  uploadingProgress: 0,
                });
              });
          }
        );
      }
    );
  };

  sendFileMessage = (imgURL) => {
    let ref = this.props.getMessagesRef();
    const { channel } = this.state;
    if (imgURL && channel) {
      this.setState({ loading: true });
      ref
        .doc(channel.id)
        .collection("message")
        .add(this.createMessage(imgURL))
        .then(() => {
          this.setState({
            loading: false,
            message: "",
            errors: [],
            uploadingState: "done",
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "add a message" }),
      });
    }
  };

  render() {
    const { loading, message, errors, modal, imgLoading } = this.state;

    return (
      <Segment className="message__form">
        <Form onSubmit={this.sendMessage}>
          <Input
            fluid
            name="message"
            onChange={this.handleChange}
            style={{ marginBottom: "0.7em" }}
            label={<Button icon={"add"} />}
            labelPosition="left"
            placeholder="Write your Message"
            value={message}
            className={
              errors.some((error) => error.message.includes("message"))
                ? "error"
                : ""
            }
          />
          <Button.Group icon widths="2">
            <Button
              color="orange"
              content="Add Replay"
              labelPosition="left"
              icon="edit"
              loading={loading}
              disabled={loading}
              type="submit"
              onClick={this.sendMessage}
            />
            <Button
              color="teal"
              content="Upload Media"
              labelPosition="right"
              icon="cloud upload"
              disabled={loading || imgLoading}
              onClick={this.openModal}
              loading={imgLoading}
            />
            <FileModal
              modal={modal}
              closeModal={this.closeModal}
              uploadFile={this.uploadFile}
            />
          </Button.Group>
        </Form>
      </Segment>
    );
  }
}
