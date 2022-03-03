const _sockets = [];

export class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.onmessage = () => {};
    this.timeout = setTimeout(() => this.send({}), 1000);

    _sockets.push(this);
  }

  close() {
    clearTimeout(this.timeout);
  }

  send(value) {
    fetch(this.url, {
      method: "SOCKET",
      body: JSON.stringify(value),
    }).then((response) => {
      const data = response.json();
      if (data) this.onmessage({ data });
      return Promise.resolve();
    });
  }
}

MockWebSocket.dispatch = () => _sockets.forEach((socket) => socket.send({}));
