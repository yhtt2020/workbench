/// <reference types="chrome" />
export interface TabContents extends Electron.WebContents {
    favicon?: string;
}
export type ContextMenuType = 'all' | 'page' | 'frame' | 'selection' | 'link' | 'editable' | 'image' | 'video' | 'audio' | 'launcher' | 'browser_action' | 'page_action' | 'action';
/**
 * Get the extension's properly typed Manifest.
 *
 * I can't seem to get TS's merged type declarations working so I'm using this
 * instead for now.
 */
export declare const getExtensionManifest: (extension: Electron.Extension) => chrome.runtime.Manifest;
export declare const getExtensionUrl: (extension: Electron.Extension, uri: string) => string | undefined;
export declare const resolveExtensionPath: (extension: Electron.Extension, uri: string) => string | undefined;
export declare const validateExtensionResource: (extension: Electron.Extension, uri: string) => Promise<string | undefined>;
export declare enum ResizeType {
    Exact = 0,
    Up = 1,
    Down = 2
}
export declare const matchSize: (imageSet: {
    [key: number]: string;
}, size: number, match: ResizeType) => string | undefined;
/** Gets the relative path to the extension's default icon. */
export declare const getIconPath: (extension: Electron.Extension, iconSize?: number, resizeType?: ResizeType) => string | undefined;
export declare const getIconImage: (extension: Electron.Extension) => Electron.NativeImage | undefined;
/**
 * @see https://developer.chrome.com/extensions/match_patterns
 */
export declare const matchesPattern: (pattern: string, url: string) => true | RegExpMatchArray | null;
export declare const matchesTitlePattern: (pattern: string, title: string) => RegExpMatchArray | null;
