/// <reference types="chrome" />
/// <reference types="node" />
import { EventEmitter } from 'events';
import { ContextMenuType } from './api/common';
import { ChromeExtensionImpl } from './impl';
import { ExtensionEvent } from './router';
export declare class ExtensionStore extends EventEmitter {
    impl: ChromeExtensionImpl;
    /** Tabs observed by the extensions system. */
    tabs: Set<Electron.WebContents>;
    /** Windows observed by the extensions system. */
    windows: Set<Electron.BrowserWindow>;
    lastFocusedWindowId?: number;
    /**
     * Map of tabs to their parent window.
     *
     * It's not possible to access the parent of a BrowserView so we must manage
     * this ourselves.
     */
    tabToWindow: WeakMap<Electron.WebContents, Electron.BrowserWindow>;
    /** Map of windows to their active tab. */
    private windowToActiveTab;
    tabDetailsCache: Map<number, Partial<chrome.tabs.Tab>>;
    windowDetailsCache: Map<number, Partial<chrome.windows.Window>>;
    constructor(impl: ChromeExtensionImpl);
    getWindowById(windowId: number): Electron.BrowserWindow | undefined;
    getLastFocusedWindow(): Electron.BrowserWindow | null | undefined;
    getCurrentWindow(): Electron.BrowserWindow | null | undefined;
    addWindow(window: Electron.BrowserWindow): void;
    createWindow(event: ExtensionEvent, details: chrome.windows.CreateData): Promise<Electron.BrowserWindow>;
    removeWindow(window: Electron.BrowserWindow): Promise<void>;
    getTabById(tabId: number): Electron.WebContents | undefined;
    addTab(tab: Electron.WebContents, window: Electron.BrowserWindow): void;
    removeTab(tab: Electron.WebContents): void;
    createTab(details: chrome.tabs.CreateProperties): Promise<Electron.WebContents>;
    getActiveTabFromWindow(win: Electron.BrowserWindow): Electron.WebContents | undefined;
    getActiveTabFromWebContents(wc: Electron.WebContents): Electron.WebContents | undefined;
    getActiveTabOfCurrentWindow(): Electron.WebContents | undefined;
    setActiveTab(tab: Electron.WebContents): void;
    buildMenuItems(extensionId: string, menuType: ContextMenuType): Electron.MenuItem[];
}
