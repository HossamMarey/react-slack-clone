import React, { Component } from "react";
import { Segment, Header, Input, Icon } from "semantic-ui-react";

export default class MessagesHeader extends Component {
  displayUniqUsers = (num) => {
    if (!this.props.isPrivateChannel) {
      return `${num} ${num > 1 ? "users" : "user"}`;
    }
  };
  render() {
    const {
      currentChannel,
      handleSearchChange,
      uniqUsersNum,
      searchLoading,
      isPrivateChannel,
    } = this.props;
    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {isPrivateChannel ? "@" : "#"}
            {currentChannel ? currentChannel.name : "Channel"}{" "}
            {isPrivateChannel ? '' : <Icon name="star outline" color="black" /> }
            
          </span>
          <Header.Subheader>
            {this.displayUniqUsers(uniqUsersNum)}
          </Header.Subheader>
        </Header>
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="search Messages"
            onChange={handleSearchChange}
            loading={searchLoading}
          />
        </Header>
      </Segment>
    );
  }
}
