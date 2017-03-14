const ws = require('nodejs-websocket');

const requestsTypes = {
  AUTHORIZE_MASTER: 'AUTHORIZE_MASTER',
  AUTHORIZE_MASTER_SUCCESS: 'AUTHORIZE_MASTER_SUCCESS',
  AUTHORIZE_MASTER_ERROR: 'AUTHORIZE_MASTER_ERROR',
  VIBRATE_DATA: 'VIBRATE_DATA'
};

let master = {
  id: null,
  conn: null
};

const port = 8001;
const server = ws.createServer(conn => {
  const {key} = conn;

  conn.on('text', data => {
    const json = JSON.parse(data);
    const {type} = json;
    if (type === requestsTypes.AUTHORIZE_MASTER) {
      const {id} = json;
      const masterAuthorized = isMasterAuthorized(id, key);
      if (masterAuthorized) {
        conn.send(JSON.stringify({type: requestsTypes.AUTHORIZE_MASTER_SUCCESS}));
      } else {
        conn.send(JSON.stringify({type: requestsTypes.AUTHORIZE_MASTER_ERROR}));
      }
    }
  });

  conn.on('close', () => {
    connectionClosed(key);
  });

  conn.on('error', () => {
    connectionClosed(key);
  });

}).listen(port);

function clearMaster() {
  master = {
    id: null,
    conn: null
  };
}

function connectionClosed(key) {
  const {conn} = master;
  if (conn === key) {
    clearMaster();
  }
}

function isMasterAuthorized(newId, newConn) {
  const {id, conn} = master;
  if (!id || !conn) {
    master = {
      id: newId,
      conn: newConn
    };
    return true;
  }

  if (id === newId && conn === newConn) {
    return true;
  }

  return false;
}
