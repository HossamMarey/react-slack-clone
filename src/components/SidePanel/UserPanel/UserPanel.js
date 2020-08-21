import React, { Component } from "react";
// import { connect } from "react-redux";

import firebase from "../../firebase";

import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from "semantic-ui-react";

class UserPanel extends Component {
  state = {
    user: this.props.currentUser,
    userAvatar: this.props.currentUser.avatar,
    modal: false,
    previewImage: "",
    imageUrl: "",
    imgFile: "",
    loadingImg: false,
    userRef: firebase.auth().currentUser,
    metadata: {
      contentType: "image/jpeg",
    },
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
      text: <span onClick={this.openModal}> change avatar </span>,
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

  openModal = () => {
    this.setState({ modal: true, imageUrl: "" });
  };
  closeModal = () => {
    this.setState({ modal: false });
  };

  handleChange = (event) => {
    const file = event.target.files[0];
    this.setState({ imgFile: file });

    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        this.setState({ previewImage: reader.result });
      });
      reader.onloadend = () => {
        this.setState({
          imageUrl: URL.createObjectURL(file),
        });
      };
    }
  };

  uploadAvatar = () => {
    const { userRef, imgFile, metadata } = this.state;

    let imgPath = `avatars/user-${userRef.uid}`;
    this.setState({ loadingImg: true });
    firebase
      .storage()
      .ref()
      .child(imgPath)
      .put(imgFile, metadata)
      .then((snap) => {
        snap.ref.getDownloadURL().then((url) => {
          this.setState({ uploadedImage: url }, () => {
            this.changeAvatar();
          });
        });
      });
  };
  changeAvatar = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(this.state.user.id)
      .update({
        avatar: this.state.uploadedImage,
      })
      .then(() => {
        this.setState({
          userAvatar: this.state.uploadedImage,
        });
      });
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadedImage,
      })
      .then(() => {
        this.setState({ loadingImg: false });
        this.closeModal();
      });
  };

  render() {
    const { user, userAvatar, modal, imageUrl, loadingImg } = this.state;

    return (
      <Grid style={{ background: "#4c3c4c" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: "0" }}>
            {/* app header  */}
            <Header inverted floated="left" as="h2">
              {/* <Icon name="coffee" size="tiny" /> */}
              <Image src="../slacky.png" size="medium" />
              <Header.Content>slacky</Header.Content>
            </Header>
            {/* user Dropdown   */}
            <Header style={{ padding: ".25em" }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image src={userAvatar} spaced="right" avatar />
                    {user.name}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>

          <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header> Change Avatar </Modal.Header>
            <Modal.Content>
              <Input
                fluid
                type="file"
                label="New avatar"
                name="previewImage"
                onChange={this.handleChange}
              />
              <Grid centered stackable columns={1}>
                <Grid.Row>
                  <Grid.Column className="ui center aligned grid prev-avater">
                    {imageUrl && <Image src={imageUrl} />}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions style={{ textAlign: "center" }}>
              <Button
                color="green"
                inverted
                onClick={this.uploadAvatar}
                loading={loadingImg}
              >
                <Icon name="save" /> Change Avatar
              </Button>
              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" /> Cancal
              </Button>
            </Modal.Actions>
          </Modal>
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
