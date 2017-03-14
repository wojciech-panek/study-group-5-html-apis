export let socket;

export const requestsTypes = {
  CLIENTS_DATA: 'CLIENTS_DATA',
  AUTHORIZE_MASTER: 'AUTHORIZE_MASTER',
  AUTHORIZE_MASTER_SUCCESS: 'AUTHORIZE_MASTER_SUCCESS',
  AUTHORIZE_MASTER_ERROR: 'AUTHORIZE_MASTER_ERROR'
};

export const send = (data) => {
  socket.send(data);
};

export const connect = () => {
  if ('WebSocket' in window) {
    socket = new WebSocket('ws://localhost:8001');
    return socket;
  }
};

export const disconnect = () => {
  socket.close();
};
