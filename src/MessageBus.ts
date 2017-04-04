module MessageBus {

  export interface Endpoint {
    postMessage(message: any, ...params: any[]): void;
    addEventListener(type: string, listener: (ev: any) => any): any;
    removeEventListener(type: string, listener: (ev: any) => any): any;
  }

  export interface Listener<T> {
    (payload?: T): any;
  }

  export class MessageBus {

    private _channels: { [name: string]: Array<Listener<any>> } = {};
    private _unlisten: () => void = null
    private _endpoint: Endpoint;

    /**
     * Wrap an `Endpoint` and provide a pubsub interface.
     *
     * @param endpoint WebWorker endpoint
     */
    constructor(endpoint: Endpoint) {

      this._endpoint = endpoint;

      let onMessage = e => this._onEvent(e.data.name, e.data.payload),
          onError   = e => this._onEvent("error", e);

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
    on<T>(name: string|number, listener: Listener<T>): void {
      var sname = name.toString();
      if (!this._channelExists(sname)) {
        this._channels[sname] = [];
      }
      this._channels[sname].push(listener);
    }

    /**
     * Unlisten from channel
     * 
     * @param name Channel to unlisten
     * @param listener Callback function
     */
    off(name: string|number, listener: Listener<any>): void {
      var sname = name.toString();
      if (this._channelExists(sname)) {
        let channel = this._channels[sname],
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
    emit(name: string|number, payload?: any): void {
      var sname = name.toString();
      this._endpoint.postMessage({
        name:    sname,
        payload: payload
      });
    }

    private _channelExists(name: string): boolean {
      return this._channels.hasOwnProperty(name);
    }

    private _onEvent(name: string, payload: any): void {
      if (this._channelExists(name)) {
        for (let listener of this._channels[name]) {
          listener(payload);
        }
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
