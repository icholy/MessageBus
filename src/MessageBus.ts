module MessageBus {

  export interface Endpoint {
    postMessage(message: any): void;
    addEventListener(type: string, listener: (ev: any) => any): any;
    removeEventListener(type: string, listener: (ev: any) => any): any;
  }

  export interface Listener {
    (payload?: any): any;
  }

  class MessageBus {

    private channels: { [name: string]: Array<Listener> } = {};
    private unlisten: () => void = null

    /**
     * Wrap an `Endpoint` and provide a pubsub interface.
     *
     * @param endpoint WebWorker endpoint
     */
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

    /**
     * Remove event listeners from supplied `Endpoint`
     * Delete all listeners from `MessageBus`
     */
    close(): void {
      if (this.unlisten !== null) {
        this.unlisten();
      }
      this.unlisten = null;
      this.channels = {};
    }

    /**
     * Listener on channel
     * 
     * @param name Channel to listen on
     * @param listener Callback function
     */
    on(name: string, listener: Listener): void {
      if (!this.channelExists(name)) {
        this.channels[name] = [];
      }
      this.channels[name].push(listener);
    }

    /**
     * Unlisten from channel
     * 
     * @param name Channel to unlisten
     * @param listener Callback function
     */
    off(name: string, listener: Listener): void {
      if (this.channelExists(name)) {
        var channel = this.channels[name],
            index   = channel.indexOf(listener);
        if (index !== -1) {
          channel.splice(index, 1);
        }
      }
    }

    /**
     * Emit a message on a channel
     * 
     * @param name Channel name
     * @param payload Message data
     */
    emit(name: string, payload?: any): void {
      this.endpoint.postMessage({ name: name, payload: payload });
      setTimeout(() => this.onEvent(name, payload), 0);
    }

    private channelExists(name: string): boolean {
      return this.channels.hasOwnProperty(name);
    }

    private onEvent(name: string, payload: any): void {
      if (this.channelExists(name)) {
        this.channels[name].forEach((listener) => {
          listener(payload);
        });
      }
    }

  }

  export function create(endpoint: Endpoint): MessageBus {
    return new MessageBus(endpoint);
  }
}
