/// <reference types="node" />
import { EventEmitter } from 'events';
import { ChromeExtensionImpl } from './impl';
export interface ChromeExtensionOptions extends ChromeExtensionImpl {
    session?: Electron.Session;
    /**
     * Path to electron-chrome-extensions module files. Might be needed if
     * JavaScript bundlers like Webpack are used in your build process.
     */
    modulePath?: string;
}
/**
 * Provides an implementation of various Chrome extension APIs to a session.
 */
export declare class ElectronChromeExtensions extends EventEmitter {
    /** Retrieve an instance of this class associated with the given session. */
    static fromSession(session: Electron.Session): ElectronChromeExtensions | undefined;
    private ctx;
    private modulePath;
    private api;
    constructor(opts?: ChromeExtensionOptions);
    setupProtocol(session: Electron.Session): void;
    private prependPreload;
    /** Add webContents to be tracked as a tab. */
    addTab(tab: Electron.WebContents, window: Electron.BrowserWindow): void;
    /** Notify extension system that the active tab has changed. */
    selectTab(tab: Electron.WebContents): void;
    /**
     * Add webContents to be tracked as an extension host which will receive
     * extension events when a chrome-extension:// resource is loaded.
     *
     * This is usually reserved for extension background pages and popups, but
     * can also be used in other special cases.
     *
     * @deprecated Extension hosts are now tracked lazily when they send
     * extension IPCs to the main process.
     */
    addExtensionHost(host: Electron.WebContents): void;
    /**
     * Get collection of menu items managed by the `chrome.contextMenus` API.
     * @see https://developer.chrome.com/extensions/contextMenus
     */
    getContextMenuItems(webContents: Electron.WebContents, params: Electron.ContextMenuParams): Electron.MenuItem[];
    /**
     * Add extensions to be visible as an extension action button.
     *
     * @deprecated Not needed in Electron >=12.
     */
    addExtension(extension: Electron.Extension): void;
    /**
     * Remove extensions from the list of visible extension action buttons.
     *
     * @deprecated Not needed in Electron >=12.
     */
    removeExtension(extension: Electron.Extension): void;
}
/**
 * @deprecated Use `ElectronChromeExtensions` instead.
 */
export declare const Extensions: typeof ElectronChromeExtensions;
