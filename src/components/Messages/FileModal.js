import React, { Component } from "react";
import { Modal, Icon, Input, Button } from "semantic-ui-react";
import mime from "mime-types";

export default class FileModal extends Component {
  state = {
    file: null,
    authorized: ["image/png", "image/jpeg"],
  };

  clearFile = () => {
    this.setState({ file: null });
  };

  addFile = (e) => {
    let file = e.target.files[0];
    if (file) {
      this.setState({ file: file });
    }
  };

  sendFile = () => {
    const { file } = this.state;
    const { uploadFile, closeModal } = this.props;
    if (file !== null) {
      if (this.isAuthorized(file.name)) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
        this.clearFile();
        closeModal();
      }
    }
  };
  isAuthorized = (fileName) => {
    return this.state.authorized.includes(mime.lookup(fileName));
  };

  render() {
    const { modal, closeModal } = this.props;
    return (
      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header> Select An Image File </Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label="File types: jpg, png"
            name="file"
            type="file"
            onChange={this.addFile}
            accept="image/png, image/jpeg"
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.sendFile}>
            <Icon name="checkmark" /> Send
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}
