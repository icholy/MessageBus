module MessageBus {

  export interface Endpoint {
    postMessage(message: any): void;
    addEventListener(type: string, listener: (ev: any) => any): any;
    removeEventListener(type: string, listener: (ev: any) => any): any;
  }

  export interface Callback {
    (payload: any): any;
  }

  class MessageBus {

    private channels: { [name: string]: Array<Callback> } = {};
    private unlisten: () => void = null

    constructor(private endpoint: Endpoint) {

      var onMessage = (e) => this.onEvent(e.data.name, e.data.payload),
          onError   = (e) => this.onEvent("error", e);

      endpoint.addEventListener("message", onMessage);
      endpoint.addEventListener("error", onError);

      this.unlisten = () => {
        endpoint.removeEventListener("message", onMessage);
        endpoint.removeEventListener("error", onError);
      };

    }

    close(): void {
      if (this.unlisten !== null) {
        this.unlisten();
      }
      this.unlisten = null;
      this.channels = {};
    }

    on(name: string, callback: Callback): void {
      if (!this.channelExists(name)) {
        this.channels[name] = [];
      }
      this.channels[name].push(callback);
    }

    off(name: string, callback: Callback): void {
      if (this.channelExists(name)) {
        var channel = this.channels[name],
            index   = channel.indexOf(callback);
        if (index !== -1) {
          channel.splice(index, 1);
        }
      }
    }

    emit(name: string, payload: any): void {
      this.endpoint.postMessage({ name: name, payload: payload });
      setTimeout(() => this.onEvent(name, payload), 0);
    }

    private channelExists(name: string): boolean {
      return this.channels.hasOwnProperty(name);
    }

    private onEvent(name: string, payload: any): void {
      if (this.channelExists(name)) {
        this.channels[name].forEach((callback) => {
          callback(payload);
        });
      }
    }

  }

  export function create(endpoint: Endpoint): MessageBus {
    return new MessageBus(endpoint);
  }
}
