import React from "react";
import { connect } from "react-redux";

import "./App.css";

import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";

import { Grid } from "semantic-ui-react";

const App = (props) => {
   
  return (
    <Grid className="app" columns="equal" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel
        currentUser={props.currentUser}
        currentChannel={props.currentChannel}
        key={props.currentUser && props.currentUser.id}
      />

      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages
          currentChannel={props.currentChannel}
          currentUser={props.currentUser}
          key={props.currentChannel && props.currentChannel.id}
          isPrivateChannel={props.isPrivateChannel}
        />
      </Grid.Column>
      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
};
const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
});

export default connect(mapStateToProps)(App);
