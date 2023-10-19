import { BrowserWindow, Session } from 'electron';
export interface PopupAnchorRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
interface PopupViewOptions {
    extensionId: string;
    session: Session;
    parent: BrowserWindow;
    url: string;
    anchorRect: PopupAnchorRect;
}
export declare class PopupView {
    static POSITION_PADDING: number;
    static BOUNDS: {
        minWidth: number;
        minHeight: number;
        maxWidth: number;
        maxHeight: number;
    };
    browserWindow?: BrowserWindow;
    parent?: BrowserWindow;
    extensionId: string;
    private anchorRect;
    private destroyed;
    private hidden;
    /** Preferred size changes are only received in Electron v12+ */
    private usingPreferredSize;
    private readyPromise;
    constructor(opts: PopupViewOptions);
    private show;
    private load;
    destroy: () => void;
    isDestroyed(): boolean;
    /** Resolves when the popup finishes loading. */
    whenReady(): Promise<void>;
    setSize(rect: Partial<Electron.Rectangle>): void;
    private maybeClose;
    private updatePosition;
    /** Backwards compat for Electron <12 */
    private queryPreferredSize;
    private updatePreferredSize;
}
export {};
