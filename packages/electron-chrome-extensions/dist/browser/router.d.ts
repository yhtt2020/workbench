import { Extension, WebContents } from 'electron';
interface RoutingDelegateObserver {
    session: Electron.Session;
    onExtensionMessage(event: Electron.IpcMainInvokeEvent, extensionId: string | undefined, handlerName: string, ...args: any[]): Promise<void>;
    addListener(listener: EventListener, extensionId: string, eventName: string): void;
    removeListener(listener: EventListener, extensionId: string, eventName: string): void;
}
/**
 * Handles event routing IPCs and delivers them to the observer with the
 * associated session.
 */
declare class RoutingDelegate {
    static get(): RoutingDelegate;
    private sessionMap;
    private constructor();
    addObserver(observer: RoutingDelegateObserver): void;
    private onRouterMessage;
    private onRemoteMessage;
    private onAddListener;
    private onRemoveListener;
}
export interface ExtensionEvent {
    sender: WebContents;
    extension: Extension;
}
export type HandlerCallback = (event: ExtensionEvent, ...args: any[]) => any;
export interface HandlerOptions {
    /** Whether the handler can be invoked on behalf of a different session. */
    allowRemote?: boolean;
    /** Whether an extension context is required to invoke the handler. */
    extensionContext: boolean;
}
interface EventListener {
    host: Electron.WebContents;
    extensionId: string;
}
export declare class ExtensionRouter {
    session: Electron.Session;
    private delegate;
    private handlers;
    private listeners;
    /**
     * Collection of all extension hosts in the session.
     *
     * Currently the router has no ability to wake up non-persistent background
     * scripts to deliver events. For now we just hold a reference to them to
     * prevent them from being terminated.
     */
    private extensionHosts;
    constructor(session: Electron.Session, delegate?: RoutingDelegate);
    private filterListeners;
    private observeListenerHost;
    addListener(listener: EventListener, extensionId: string, eventName: string): void;
    removeListener(listener: EventListener, extensionId: string, eventName: string): void;
    private getHandler;
    onExtensionMessage(event: Electron.IpcMainInvokeEvent, extensionId: string | undefined, handlerName: string, ...args: any[]): Promise<any>;
    private handle;
    /** Returns a callback to register API handlers for the given context. */
    apiHandler(): (name: string, callback: HandlerCallback, opts?: HandlerOptions) => void;
    /**
     * Sends extension event to the host for the given extension ID if it
     * registered a listener for it.
     */
    sendEvent(extensionId: string | undefined, eventName: string, ...args: any[]): void;
    /** Broadcasts extension event to all extension hosts listening for it. */
    broadcastEvent(eventName: string, ...args: any[]): void;
}
export {};
