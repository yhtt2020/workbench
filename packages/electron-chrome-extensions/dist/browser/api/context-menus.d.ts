import { ExtensionContext } from '../context';
export declare class ContextMenusAPI {
    private ctx;
    private menus;
    constructor(ctx: ExtensionContext);
    private addContextItem;
    private buildMenuItem;
    private buildMenuItemsFromTemplate;
    buildMenuItemsForParams(webContents: Electron.WebContents, params: Electron.ContextMenuParams): Electron.MenuItem[];
    private buildMenuItemsForExtension;
    private create;
    private remove;
    private removeAll;
    private onClicked;
}
