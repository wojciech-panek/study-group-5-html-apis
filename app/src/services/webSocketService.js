export let socket;

export const requestsTypes = {
  AUTHORIZE_MASTER: 'AUTHORIZE_MASTER',
  VIBRATE_DATA: 'VIBRATE_DATA',
  AUTHORIZE_MASTER_SUCCESS: 'AUTHORIZE_MASTER_SUCCESS',
  AUTHORIZE_MASTER_ERROR: 'AUTHORIZE_MASTER_ERROR'
};

export const send = (data) => {
  socket.send(data);
};

export const connect = () => {
  if ('WebSocket' in window) {
    console.log('WebSocket is supported by your Browser!');
    socket = new WebSocket('ws://localhost:8001');
    return socket;
  }
};

export const disconnect = () => {
  console.log('Disconnecting...');
  socket.close();
};
