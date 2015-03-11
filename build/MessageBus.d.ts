declare module MessageBus {
    interface Endpoint {
        postMessage(message: any): void;
        addEventListener(type: string, listener: (ev: any) => any): any;
        removeEventListener(type: string, listener: (ev: any) => any): any;
    }
    interface Listener {
        (payload?: any): any;
    }
    class MessageBus {
        private _channels;
        private _unlisten;
        private _endpoint;
        /**
         * Wrap an `Endpoint` and provide a pubsub interface.
         *
         * @param endpoint WebWorker endpoint
         */
        constructor(endpoint: Endpoint);
        /**
         * Remove event listeners from supplied `Endpoint`
         * Delete all listeners from `MessageBus`
         */
        close(): void;
        /**
         * Listener on channel
         *
         * @param name Channel to listen on
         * @param listener Callback function
         */
        on(name: string, listener: Listener): void;
        /**
         * Unlisten from channel
         *
         * @param name Channel to unlisten
         * @param listener Callback function
         */
        off(name: string, listener: Listener): void;
        /**
         * Emit a message on a channel
         *
         * @param name Channel name
         * @param payload Message data
         */
        emit(name: string, payload?: any): void;
        private _channelExists(name);
        private _onEvent(name, payload);
    }
    /**
     * Factory function for creating a `MessageBus`
     *
     * @param endpoint WebWorker endpoint
     */
    function create(endpoint: Endpoint): MessageBus;
}
