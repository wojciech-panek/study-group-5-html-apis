import React, {Component} from 'react';
import { browserHistory } from 'react-router';
import {connect, socket, disconnect, send} from '../../services/webSocketService'

navigator.getUserMedia  = navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;



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

    if (navigator.getUserMedia) {
      navigator.getUserMedia({audio: true, video: false}, function(stream) {
        send(stream);
      }, (err) => {
        console.log(err);
      });
    } else {
      browserHistory.push('/unsupported');
    }
  }

  componentWillUnmount() {
    disconnect();
  }

  render() {
    return (
      <div className="home">
      </div>
    );
  }
}
