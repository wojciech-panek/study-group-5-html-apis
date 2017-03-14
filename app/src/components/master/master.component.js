import React, {Component} from 'react';
import {connect, disconnect, send, requestsTypes} from '../../services/webSocketService';
import uuid from 'uuid/v4';

export default class Master extends Component {

  constructor() {
    super();

    this.state = {
      connected: false,
      error: null,
      master: {
        id: null,
        authorized: false
      }
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.send = this.send.bind(this);
    this.onConnectionOpen = this.onConnectionOpen.bind(this);
    this.onConnectionClose = this.onConnectionClose.bind(this);
    this.onConnectionError = this.onConnectionError.bind(this);
    this.onMessageReceive = this.onMessageReceive.bind(this);
    this.authorizeMaster = this.authorizeMaster.bind(this);
    this.sendClientData = this.sendClientData.bind(this);
  }

  componentDidMount() {
    this.socket = connect();
    this.socket.onopen = () => this.onConnectionOpen();
    this.socket.onerror = (err) => this.onConnectionError(err);
    this.socket.onmessage = ({data}) => this.onMessageReceive(data);
    this.socket.onclose = () => this.onConnectionClose();
  }

  connect() {
    this.socket = connect();
  }

  disconnect() {
    disconnect();
  }

  onMessageReceive(data) {
    const json = JSON.parse(data);
    const {type} = json;
    const {AUTHORIZE_MASTER_SUCCESS, AUTHORIZE_MASTER_ERROR} = requestsTypes;

    if (type === AUTHORIZE_MASTER_ERROR) {
      this.setState({error: AUTHORIZE_MASTER_ERROR});
      this.disconnect();
    } else if (type === AUTHORIZE_MASTER_SUCCESS) {
      this.setState({master: {authorized: true}});
    }
  }

  onConnectionOpen() {
    this.setState({connected: true});
    this.authorizeMaster();
  }

  onConnectionClose() {
    this.setState({connected: false});
  }

  onConnectionError(err) {
    this.setState({error: err, connected: false});
  }

  sendClientData(data) {
    const {CLIENTS_DATA} = requestsTypes;
    const json = JSON.stringify({type: CLIENTS_DATA, data});
    this.send(json);
  }

  send(data) {
    send(data);
  }

  authorizeMaster() {
    const id = uuid();
    const {AUTHORIZE_MASTER} = requestsTypes;

    this.setState({master: {id}});

    const data = JSON.stringify({
      type: AUTHORIZE_MASTER,
      id
    });
    this.send(data);
  }

  componentWillUnmount() {
    this.socket = null;
    this.disconnect();
  }

  get isConnected() {
    return this.state.connected ? 'connected' : 'disconnected';
  }

  render() {
    const {error, master} = this.state;
    return (
      <div className="master__content">
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

        <button onClick={() => this.sendClientData({test: 'test'})}>Sent test data</button>
      </div>
    );
  }
}
