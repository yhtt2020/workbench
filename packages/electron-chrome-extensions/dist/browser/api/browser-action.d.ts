import { ExtensionContext } from '../context';
export declare class BrowserActionAPI {
    private ctx;
    private actionMap;
    private popup?;
    private observers;
    private queuedUpdate;
    constructor(ctx: ExtensionContext);
    private setupSession;
    setupProtocol(session: Electron.Session): boolean;
    private handleCrxRequest;
    private getAction;
    removeActions(extensionId: string): void;
    private getPopupUrl;
    processExtension(extension: Electron.Extension): void;
    private getState;
    private activate;
    private activateClick;
    private activateContextMenu;
    private onUpdate;
}
