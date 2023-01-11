/// <reference types="node" />
import { EventEmitter } from 'events';
import { ExtensionContext } from '../context';
export declare class RuntimeAPI extends EventEmitter {
    private ctx;
    constructor(ctx: ExtensionContext);
    private openOptionsPage;
}
