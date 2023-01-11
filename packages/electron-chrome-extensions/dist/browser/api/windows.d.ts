import { ExtensionContext } from '../context';
export declare class WindowsAPI {
    private ctx;
    static WINDOW_ID_NONE: number;
    static WINDOW_ID_CURRENT: number;
    constructor(ctx: ExtensionContext);
    private observeWindow;
    private createWindowDetails;
    private getWindowDetails;
    private getWindowFromId;
    private get;
    private getLastFocused;
    private getAll;
    private create;
    private update;
    private remove;
    onCreated(windowId: number): void;
    onRemoved(windowId: number): void;
    onFocusChanged(windowId: number): void;
}
