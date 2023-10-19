import { ExtensionContext } from '../context';
export declare class NotificationsAPI {
    private ctx;
    private registry;
    constructor(ctx: ExtensionContext);
    private clear;
    private create;
    private getAll;
    private getPermissionLevel;
    private update;
}
