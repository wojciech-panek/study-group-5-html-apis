import { browserHistory } from 'react-router';
export let socket;

export const send = (data) => {
  socket.send(data);
};

export const connect = () => {
  if ('WebSocket' in window) {
    console.log('WebSocket is supported by your Browser!');
    socket = new WebSocket('ws://localhost:8001');
  }
  else {
    browserHistory.push('/unsupported');
  }
};

export const disconnect = () => {
  console.log('Disconnecting...');
  socket.close();
};
