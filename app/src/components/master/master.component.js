import React, { Component } from 'react';
import uuid from 'uuid/v4';

import { connect, disconnect, send, requestsTypes } from '../../services/webSocketService';
import AudioLoader from './audioLoader/audioLoader.component';

export default class Master extends Component {

  constructor() {
    super();

    this.state = {
      connected: false,
      error: null,
      master: {
        id: null,
        authorized: false,
      },
    };
  }

  componentDidMount() {
    this.socket = connect();
    this.socket.onopen = () => this.onConnectionOpen();
    this.socket.onerror = (err) => this.onConnectionError(err);
    this.socket.onmessage = ({ data }) => this.onMessageReceive(data);
    this.socket.onclose = () => this.onConnectionClose();
  }

  componentWillUnmount() {
    this.socket = null;
    disconnect();
  }

  onMessageReceive = (data) => {
    const json = JSON.parse(data);
    const { type } = json;
    const { AUTHORIZE_MASTER_SUCCESS, AUTHORIZE_MASTER_ERROR } = requestsTypes;

    if (type === AUTHORIZE_MASTER_ERROR) {
      this.setState({ error: AUTHORIZE_MASTER_ERROR });
      disconnect();
    } else if (type === AUTHORIZE_MASTER_SUCCESS) {
      this.setState({ master: { authorized: true } });
    }
  };

  onConnectionOpen = () => {
    this.setState({ connected: true });
    this.authorizeMaster();
  };

  onConnectionClose = () => {
    this.setState({ connected: false });
  };

  onConnectionError = (err) => {
    this.setState({ error: err, connected: false });
  };

  sendClientData = (data) => {
    const { CLIENTS_DATA } = requestsTypes;
    const json = JSON.stringify({ type: CLIENTS_DATA, data });
    send(json);
  };

  authorizeMaster() {
    const id = uuid();
    const { AUTHORIZE_MASTER } = requestsTypes;

    this.setState({ master: { id } });

    const data = JSON.stringify({
      type: AUTHORIZE_MASTER,
      id,
    });
    send(data);
  }

  get isConnected() {
    return this.state.connected ? 'connected' : 'disconnected';
  }

  render() {
    const { error, master } = this.state;
    return (
      <div className="master">
        <div className="master__status-wrapper">
          <strong className="master__status">You are: {this.isConnected}</strong>
        </div>

        {error &&
          <div className="master__error-wrapper">
             <strong className="master__error">Error: {error}</strong>
          </div>}

        {master.authorized &&
        <div className="master__info-wrapper">
          <strong className="master__info">You are master!</strong>
        </div>}

        <AudioLoader onAudioDataChange={this.sendClientData} />
      </div>
    );
  }
}
