module MessageBus {

  export interface Endpoint {
    postMessage(message: any): void;
    addEventListener(type: string, listener: (ev: any) => any): any;
    removeEventListener(type: string, listener: (ev: any) => any): any;
  }

  export interface Listener {
    (payload?: any): any;
  }

  export class MessageBus {

    private _channels: { [name: string]: Array<Listener> } = {};
    private _unlisten: () => void = null
    private _endpoint: Endpoint;

    /**
     * Wrap an `Endpoint` and provide a pubsub interface.
     *
     * @param endpoint WebWorker endpoint
     */
    constructor(endpoint: Endpoint) {

      this._endpoint = endpoint;

      var onMessage = (e) => this._onEvent(e.data.name, e.data.payload),
          onError   = (e) => this._onEvent("error", e);

      endpoint.addEventListener("message", onMessage);
      endpoint.addEventListener("error", onError);

      this._unlisten = () => {
        endpoint.removeEventListener("message", onMessage);
        endpoint.removeEventListener("error", onError);
      };

    }

    /**
     * Remove event listeners from supplied `Endpoint`
     * Delete all listeners from `MessageBus`
     */
    close(): void {
      if (this._unlisten !== null) {
        this._unlisten();
      }
      this._unlisten = null;
      this._channels = {};
    }

    /**
     * Listener on channel
     * 
     * @param name Channel to listen on
     * @param listener Callback function
     */
    on(name: string, listener: Listener): void {
      if (!this._channelExists(name)) {
        this._channels[name] = [];
      }
      this._channels[name].push(listener);
    }

    /**
     * Unlisten from channel
     * 
     * @param name Channel to unlisten
     * @param listener Callback function
     */
    off(name: string, listener: Listener): void {
      if (this._channelExists(name)) {
        var channel = this._channels[name],
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
      this._endpoint.postMessage({ name: name, payload: payload });
    }

    private _channelExists(name: string): boolean {
      return this._channels.hasOwnProperty(name);
    }

    private _onEvent(name: string, payload: any): void {
      if (this._channelExists(name)) {
        this._channels[name].forEach((listener) => {
          listener(payload);
        });
      }
    }

  }

  /**
   * Factory function for creating a `MessageBus`
   *
   * @param endpoint WebWorker endpoint
   */
  export function create(endpoint: Endpoint): MessageBus {
    return new MessageBus(endpoint);
  }
}
