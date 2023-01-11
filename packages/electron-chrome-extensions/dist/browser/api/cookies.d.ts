import { ExtensionContext } from '../context';
export declare class CookiesAPI {
    private ctx;
    private get cookies();
    constructor(ctx: ExtensionContext);
    private get;
    private getAll;
    private set;
    private remove;
    private getAllCookieStores;
    private onChanged;
}
