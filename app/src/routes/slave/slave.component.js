import React, {Component} from 'react';
import {connect, socket, disconnect} from '../../services/webSocketService'

export default class App extends Component {

  componentDidMount() {
    connect();
    this.socket = socket;
    this.socket.onopen = () => {
      console.log('Connection success');
    };

    this.socket.onerror = () => {
      console.log('Error');
    };

    this.socket.onmessage = (evt) => {
      let receivedData = evt.data;
    };

    this.socket.onclose = () => {
      console.log('Closing connection');
    };
  }

  componentWillUnmount() {
    disconnect();
  }

  render() {
    return (
      <div className="home">
        Hello, world!
      </div>
    );
  }
}
