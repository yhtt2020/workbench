import { ExtensionContext } from '../context';
export declare class TabsAPI {
    private ctx;
    static TAB_ID_NONE: number;
    static WINDOW_ID_NONE: number;
    static WINDOW_ID_CURRENT: number;
    constructor(ctx: ExtensionContext);
    private observeTab;
    private createTabDetails;
    private getTabDetails;
    private get;
    private getAllInWindow;
    private getCurrent;
    private getSelected;
    private create;
    private insertCSS;
    private query;
    private reload;
    private update;
    private remove;
    private goForward;
    private goBack;
    onCreated(tabId: number): void;
    onUpdated(tabId: number): void;
    onRemoved(tabId: number): void;
    onActivated(tabId: number): void;
}
