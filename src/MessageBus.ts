module MessageBus {

  export interface Endpoint {
    postMessage(message: any): void;
    addEventListener(type: string, listener: (ev: any) => any): any;
    removeEventListener(type: string, listener: (ev: any) => any): any;
  }

  export interface Callback {
    (data: any): any;
  }

  class MessageBus {

    private channels: { [name: string]: Array<Callback> } = {};
    private unlisten: () => void = null

    constructor(private endpoint: Endpoint) {

      var onMessage = (e) => this.onMessage(e),
          onError   = (e) => this.onError(e);

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

    emit(name: string, data: any): void {
      this.endpoint.postMessage({ name: name, data: data });
    }

    private channelExists(name: string): boolean {
      return this.channels.hasOwnProperty(name);
    }

    private onMessage(ev: MessageEvent): void {
      var msg = ev.data;
      if (this.channelExists(msg.name)) {
        this.channels[msg.name].forEach((callback) => {
          callback(msg.data);
        });
      } else {
        this.onUnhandled(ev);
      }
    }

    private onError(ev: ErrorEvent): void {
      if (this.channelExists("error")) {
        this.channels["error"].forEach((callback) => {
          callback(ev);
        });
      } else {
        this.onUnhandled(ev);
      }
    }

    private onUnhandled(ev: any): void {
      console.log("Unhandled Event:", ev);
    }

  }

  export function create(endpoint: Endpoint): MessageBus {
    return new MessageBus(endpoint);
  }
}