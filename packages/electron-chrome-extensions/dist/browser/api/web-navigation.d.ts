import { ExtensionContext } from '../context';
export declare class WebNavigationAPI {
    private ctx;
    constructor(ctx: ExtensionContext);
    private observeTab;
    private getFrame;
    private getAllFrames;
    private sendNavigationEvent;
    private onCreatedNavigationTarget;
    private onBeforeNavigate;
    private onCommitted;
    private onHistoryStateUpdated;
    private onDOMContentLoaded;
    private onFinishLoad;
}
