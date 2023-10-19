/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/browser/api/browser-action.ts":
/*!*******************************************!*\
  !*** ./src/browser/api/browser-action.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BrowserActionAPI: () => (/* binding */ BrowserActionAPI)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../popup */ "./src/browser/popup.ts");
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common */ "./src/browser/api/common.ts");




const debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/index.js")('electron-chrome-extensions:browserAction');

if (!electron__WEBPACK_IMPORTED_MODULE_0__.app.isReady()) {
  electron__WEBPACK_IMPORTED_MODULE_0__.protocol.registerSchemesAsPrivileged([{
    scheme: 'crx',
    privileges: {
      bypassCSP: true
    }
  }]);
}

const getBrowserActionDefaults = extension => {
  const manifest = (0,_common__WEBPACK_IMPORTED_MODULE_2__.getExtensionManifest)(extension);
  const {
    browser_action
  } = manifest;

  if (typeof browser_action === 'object') {
    const action = {};
    action.title = browser_action.default_title || manifest.name;
    const iconPath = (0,_common__WEBPACK_IMPORTED_MODULE_2__.getIconPath)(extension);
    if (iconPath) action.icon = {
      path: iconPath
    };

    if (browser_action.default_popup) {
      action.popup = browser_action.default_popup;
    }

    return action;
  }
};

class BrowserActionAPI {
  constructor(ctx) {
    this.ctx = ctx;
    this.actionMap = new Map();
    this.popup = void 0;
    this.observers = new Set();
    this.queuedUpdate = false;

    this.handleCrxRequest = (request, callback) => {
      debug('%s', request.url);
      let response;

      try {
        const url = new URL(request.url);
        const {
          hostname: requestType
        } = url;

        switch (requestType) {
          case 'extension-icon':
            {
              const tabId = url.searchParams.get('tabId');
              const fragments = url.pathname.split('/');
              const extensionId = fragments[1];
              const imageSize = parseInt(fragments[2], 10);
              const resizeType = parseInt(fragments[3], 10) || _common__WEBPACK_IMPORTED_MODULE_2__.ResizeType.Up;
              const extension = this.ctx.session.getExtension(extensionId);
              let iconDetails;
              const action = this.actionMap.get(extensionId);

              if (action) {
                var _action$tabs$tabId;

                iconDetails = tabId && ((_action$tabs$tabId = action.tabs[tabId]) === null || _action$tabs$tabId === void 0 ? void 0 : _action$tabs$tabId.icon) || action.icon;
              }

              let iconImage;

              if (extension && iconDetails) {
                if (typeof iconDetails.path === 'string') {
                  const iconAbsPath = (0,_common__WEBPACK_IMPORTED_MODULE_2__.resolveExtensionPath)(extension, iconDetails.path);
                  if (iconAbsPath) iconImage = electron__WEBPACK_IMPORTED_MODULE_0__.nativeImage.createFromPath(iconAbsPath);
                } else if (typeof iconDetails.path === 'object') {
                  const imagePath = (0,_common__WEBPACK_IMPORTED_MODULE_2__.matchSize)(iconDetails.path, imageSize, resizeType);
                  const iconAbsPath = imagePath && (0,_common__WEBPACK_IMPORTED_MODULE_2__.resolveExtensionPath)(extension, imagePath);
                  if (iconAbsPath) iconImage = electron__WEBPACK_IMPORTED_MODULE_0__.nativeImage.createFromPath(iconAbsPath);
                } else if (typeof iconDetails.imageData === 'string') {
                  iconImage = electron__WEBPACK_IMPORTED_MODULE_0__.nativeImage.createFromDataURL(iconDetails.imageData);
                } else if (typeof iconDetails.imageData === 'object') {
                  const imageData = (0,_common__WEBPACK_IMPORTED_MODULE_2__.matchSize)(iconDetails.imageData, imageSize, resizeType);
                  iconImage = imageData ? electron__WEBPACK_IMPORTED_MODULE_0__.nativeImage.createFromDataURL(imageData) : undefined;
                }
              }

              if (iconImage) {
                response = {
                  statusCode: 200,
                  mimeType: 'image/png',
                  data: iconImage.toPNG()
                };
              } else {
                response = {
                  statusCode: 400
                };
              }

              break;
            }

          default:
            {
              response = {
                statusCode: 400
              };
            }
        }
      } catch (e) {
        console.error(e);
        response = {
          statusCode: 500
        };
      }

      callback(response);
    };

    const handle = this.ctx.router.apiHandler();

    const getter = propName => ({
      extension
    }, details = {}) => {
      const {
        tabId
      } = details;
      const action = this.getAction(extension.id);
      let result;

      if (tabId) {
        if (action.tabs[tabId]) {
          result = action.tabs[tabId][propName];
        } else {
          result = action[propName];
        }
      } else {
        result = action[propName];
      }

      return result;
    };

    const setDetails = ({
      extension
    }, details, propName) => {
      const {
        tabId
      } = details;
      let value = details[propName] || undefined;

      if (typeof value === 'undefined') {
        const defaults = getBrowserActionDefaults(extension);
        value = defaults ? defaults[propName] : value;
      }

      const valueObj = {
        [propName]: value
      };
      const action = this.getAction(extension.id);

      if (tabId) {
        const tabAction = action.tabs[tabId] || (action.tabs[tabId] = {});
        Object.assign(tabAction, valueObj);
      } else {
        Object.assign(action, valueObj);
      }

      this.onUpdate();
    };

    const setter = propName => (event, details) => setDetails(event, details, propName);

    const handleProp = (prop, key) => {
      handle(`browserAction.get${prop}`, getter(key));
      handle(`browserAction.set${prop}`, setter(key));
    };

    handleProp('BadgeBackgroundColor', 'color');
    handleProp('BadgeText', 'text');
    handleProp('Title', 'title');
    handleProp('Popup', 'popup'); // setIcon is unique in that it can pass in a variety of properties. Here we normalize them
    // to use 'icon'.

    handle('browserAction.setIcon', (event, {
      tabId,
      ...details
    }) => {
      setDetails(event, {
        tabId,
        icon: details
      }, 'icon');
      setDetails(event, {
        tabId,
        iconModified: Date.now()
      }, 'iconModified');
    }); // browserAction preload API

    const preloadOpts = {
      allowRemote: true,
      extensionContext: false
    };
    handle('browserAction.getState', this.getState.bind(this), preloadOpts);
    handle('browserAction.activate', this.activate.bind(this), preloadOpts);
    handle('browserAction.addObserver', event => {
      const {
        sender: webContents
      } = event;
      this.observers.add(webContents);
      webContents.once('destroyed', () => {
        this.observers.delete(webContents);
      });
    }, preloadOpts);
    handle('browserAction.removeObserver', event => {
      const {
        sender: webContents
      } = event;
      this.observers.delete(webContents);
    }, preloadOpts);
    this.ctx.store.on('active-tab-changed', () => {
      this.onUpdate();
    }); // Clear out tab details when removed

    this.ctx.store.on('tab-removed', tabId => {
      for (const [, actionDetails] of this.actionMap) {
        if (actionDetails.tabs[tabId]) {
          delete actionDetails.tabs[tabId];
        }
      }

      this.onUpdate();
    });
    this.setupSession(this.ctx.session);
  }

  setupSession(session) {
    session.on('extension-loaded', (event, extension) => {
      this.processExtension(extension);
    });
    session.on('extension-unloaded', (event, extension) => {
      this.removeActions(extension.id);
    });
    session.protocol.registerBufferProtocol('crx', this.handleCrxRequest);
  } //注册协议


  setupProtocol(session) {
    const result = session.protocol.registerBufferProtocol('crx', this.handleCrxRequest);
    return result;
  }

  getAction(extensionId) {
    let action = this.actionMap.get(extensionId);

    if (!action) {
      action = {
        tabs: {}
      };
      this.actionMap.set(extensionId, action);
      this.onUpdate();
    }

    return action;
  } // TODO: Make private for v4 major release.


  removeActions(extensionId) {
    if (this.actionMap.has(extensionId)) {
      this.actionMap.delete(extensionId);
    }

    this.onUpdate();
  }

  getPopupUrl(extensionId, tabId) {
    var _action$tabs$tabId2;

    const action = this.getAction(extensionId);
    const popupPath = ((_action$tabs$tabId2 = action.tabs[tabId]) === null || _action$tabs$tabId2 === void 0 ? void 0 : _action$tabs$tabId2.popup) || action.popup || undefined;
    let url; // Allow absolute URLs

    try {
      url = popupPath && new URL(popupPath).href;
    } catch {} // Fallback to relative path


    if (!url) {
      try {
        url = popupPath && new URL(popupPath, `chrome-extension://${extensionId}`).href;
      } catch {}
    }

    return url;
  } // TODO: Make private for v4 major release.


  processExtension(extension) {
    const defaultAction = getBrowserActionDefaults(extension);

    if (defaultAction) {
      const action = this.getAction(extension.id);
      Object.assign(action, defaultAction);
    }
  }

  getState() {
    // Get state without icon data.
    const actions = Array.from(this.actionMap.entries()).map(([id, details]) => {
      const {
        icon,
        tabs,
        ...rest
      } = details;
      const tabsInfo = {};

      for (const tabId of Object.keys(tabs)) {
        const {
          icon,
          ...rest
        } = tabs[tabId];
        tabsInfo[tabId] = rest;
      }

      return {
        id,
        tabs: tabsInfo,
        ...rest
      };
    });
    const activeTab = this.ctx.store.getActiveTabOfCurrentWindow();
    return {
      activeTabId: activeTab === null || activeTab === void 0 ? void 0 : activeTab.id,
      actions
    };
  }

  activate({
    sender
  }, details) {
    const {
      eventType,
      extensionId,
      tabId
    } = details;
    debug(`activate [eventType: ${eventType}, extensionId: '${extensionId}', tabId: ${tabId}, senderId: ${sender.id}]`);

    switch (eventType) {
      case 'click':
        this.activateClick(details);
        break;

      case 'contextmenu':
        this.activateContextMenu(details);
        break;

      default:
        console.debug(`Ignoring unknown browserAction.activate event '${eventType}'`);
    }
  }

  activateClick(details) {
    const {
      extensionId,
      tabId,
      anchorRect
    } = details;

    if (this.popup) {
      const toggleExtension = !this.popup.isDestroyed() && this.popup.extensionId === extensionId;
      this.popup.destroy();
      this.popup = undefined;

      if (toggleExtension) {
        debug('skipping activate to close popup');
        return;
      }
    }

    const tab = tabId >= 0 ? this.ctx.store.getTabById(tabId) : this.ctx.store.getActiveTabOfCurrentWindow();

    if (!tab) {
      throw new Error(`Unable to get active tab`);
    }

    const popupUrl = this.getPopupUrl(extensionId, tab.id);

    if (popupUrl) {
      const win = this.ctx.store.tabToWindow.get(tab);

      if (!win) {
        throw new Error('Unable to get BrowserWindow from active tab');
      }

      this.popup = new _popup__WEBPACK_IMPORTED_MODULE_1__.PopupView({
        extensionId,
        session: this.ctx.session,
        parent: win,
        url: popupUrl,
        anchorRect
      });
      debug(`opened popup: ${popupUrl}`);
      this.ctx.emit('browser-action-popup-created', this.popup);
    } else {
      debug(`dispatching onClicked for ${extensionId}`);
      const tabDetails = this.ctx.store.tabDetailsCache.get(tab.id);
      this.ctx.router.sendEvent(extensionId, 'browserAction.onClicked', tabDetails);
    }
  }

  activateContextMenu(details) {
    var _manifest$options_ui;

    const {
      extensionId,
      anchorRect
    } = details;
    const extension = this.ctx.session.getExtension(extensionId);

    if (!extension) {
      throw new Error(`Unregistered extension '${extensionId}'`);
    }

    const manifest = (0,_common__WEBPACK_IMPORTED_MODULE_2__.getExtensionManifest)(extension);
    const menu = new electron__WEBPACK_IMPORTED_MODULE_0__.Menu();

    const append = opts => menu.append(new electron__WEBPACK_IMPORTED_MODULE_0__.MenuItem(opts));

    const appendSeparator = () => menu.append(new electron__WEBPACK_IMPORTED_MODULE_0__.MenuItem({
      type: 'separator'
    }));

    append({
      label: extension.name,
      click: () => {
        const homePageUrl = manifest.homepage_url || `https://chrome.google.com/webstore/detail/${extension.id}`;
        this.ctx.store.createTab({
          url: homePageUrl
        });
      }
    });
    appendSeparator();
    const contextMenuItems = this.ctx.store.buildMenuItems(extensionId, 'browser_action');

    if (contextMenuItems.length > 0) {
      contextMenuItems.forEach(item => menu.append(item));
      appendSeparator();
    }

    const optionsPage = manifest.options_page || ((_manifest$options_ui = manifest.options_ui) === null || _manifest$options_ui === void 0 ? void 0 : _manifest$options_ui.page);
    const optionsPageUrl = optionsPage ? (0,_common__WEBPACK_IMPORTED_MODULE_2__.getExtensionUrl)(extension, optionsPage) : undefined;
    append({
      label: 'Options',
      enabled: typeof optionsPageUrl === 'string',
      click: () => {
        this.ctx.store.createTab({
          url: optionsPageUrl
        });
      }
    });

    if ( true && process.env.DEBUG) {
      append({
        label: 'Remove extension',
        click: () => {
          debug(`removing extension "${extension.name}" (${extension.id})`);
          this.ctx.session.removeExtension(extension.id);
        }
      });
    }

    menu.popup({
      x: Math.floor(anchorRect.x),
      y: Math.floor(anchorRect.y + anchorRect.height)
    });
  }

  onUpdate() {
    if (this.queuedUpdate) return;
    this.queuedUpdate = true;
    queueMicrotask(() => {
      this.queuedUpdate = false;
      debug(`dispatching update to ${this.observers.size} observer(s)`);
      Array.from(this.observers).forEach(observer => {
        if (!observer.isDestroyed()) {
          observer.send('browserAction.update');
        }
      });
    });
  }

}

/***/ }),

/***/ "./src/browser/api/commands.ts":
/*!*************************************!*\
  !*** ./src/browser/api/commands.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommandsAPI: () => (/* binding */ CommandsAPI)
/* harmony export */ });
/**
 * Stub implementation for chrome.commands API.
 */
class CommandsAPI {
  constructor(ctx) {
    this.ctx = ctx;
    const handle = this.ctx.router.apiHandler();
    handle('commands.getAll', this.getAll);
  }

  getAll() {
    return [];
  }

}

/***/ }),

/***/ "./src/browser/api/common.ts":
/*!***********************************!*\
  !*** ./src/browser/api/common.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResizeType: () => (/* binding */ ResizeType),
/* harmony export */   getExtensionManifest: () => (/* binding */ getExtensionManifest),
/* harmony export */   getExtensionUrl: () => (/* binding */ getExtensionUrl),
/* harmony export */   getIconImage: () => (/* binding */ getIconImage),
/* harmony export */   getIconPath: () => (/* binding */ getIconPath),
/* harmony export */   matchSize: () => (/* binding */ matchSize),
/* harmony export */   matchesPattern: () => (/* binding */ matchesPattern),
/* harmony export */   matchesTitlePattern: () => (/* binding */ matchesTitlePattern),
/* harmony export */   resolveExtensionPath: () => (/* binding */ resolveExtensionPath),
/* harmony export */   validateExtensionResource: () => (/* binding */ validateExtensionResource)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_2__);




/**
 * Get the extension's properly typed Manifest.
 *
 * I can't seem to get TS's merged type declarations working so I'm using this
 * instead for now.
 */
const getExtensionManifest = extension => extension.manifest;
const getExtensionUrl = (extension, uri) => {
  try {
    return new URL(uri, extension.url).href;
  } catch {}
};
const resolveExtensionPath = (extension, uri) => {
  const resPath = path__WEBPACK_IMPORTED_MODULE_1__.join(extension.path, uri); // prevent any parent traversals

  if (!resPath.startsWith(extension.path)) return;
  return resPath;
};
const validateExtensionResource = async (extension, uri) => {
  const resPath = resolveExtensionPath(extension, uri);
  if (!resPath) return;

  try {
    await fs__WEBPACK_IMPORTED_MODULE_0__.promises.stat(resPath);
  } catch {
    return; // doesn't exist
  }

  return resPath;
};
let ResizeType;

(function (ResizeType) {
  ResizeType[ResizeType["Exact"] = 0] = "Exact";
  ResizeType[ResizeType["Up"] = 1] = "Up";
  ResizeType[ResizeType["Down"] = 2] = "Down";
})(ResizeType || (ResizeType = {}));

const matchSize = (imageSet, size, match) => {
  // TODO: match based on size
  const first = parseInt(Object.keys(imageSet).pop(), 10);
  return imageSet[first];
};
/** Gets the relative path to the extension's default icon. */

const getIconPath = (extension, iconSize = 32, resizeType = ResizeType.Up) => {
  const {
    browser_action,
    icons
  } = getExtensionManifest(extension);
  const {
    default_icon
  } = browser_action || {};

  if (typeof default_icon === 'string') {
    const iconPath = default_icon;
    return iconPath;
  } else if (typeof default_icon === 'object') {
    const iconPath = matchSize(default_icon, iconSize, resizeType);
    return iconPath;
  } else if (typeof icons === 'object') {
    const iconPath = matchSize(icons, iconSize, resizeType);
    return iconPath;
  }
};
const getIconImage = extension => {
  const iconPath = getIconPath(extension);
  const iconAbsolutePath = iconPath && resolveExtensionPath(extension, iconPath);
  return iconAbsolutePath ? electron__WEBPACK_IMPORTED_MODULE_2__.nativeImage.createFromPath(iconAbsolutePath) : undefined;
};

const escapePattern = pattern => pattern.replace(/[\\^$+?.()|[\]{}]/g, '\\$&');
/**
 * @see https://developer.chrome.com/extensions/match_patterns
 */


const matchesPattern = (pattern, url) => {
  if (pattern === '<all_urls>') return true;
  const regexp = new RegExp(`^${pattern.split('*').map(escapePattern).join('.*')}$`);
  return url.match(regexp);
};
const matchesTitlePattern = (pattern, title) => {
  const regexp = new RegExp(`^${pattern.split('*').map(escapePattern).join('.*')}$`);
  return title.match(regexp);
};

/***/ }),

/***/ "./src/browser/api/context-menus.ts":
/*!******************************************!*\
  !*** ./src/browser/api/context-menus.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContextMenusAPI: () => (/* binding */ ContextMenusAPI)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common */ "./src/browser/api/common.ts");


const DEFAULT_CONTEXTS = ['page'];

const getContextTypesFromParams = params => {
  const contexts = new Set(['all']);

  switch (params.mediaType) {
    case 'audio':
    case 'video':
    case 'image':
      contexts.add(params.mediaType);
  }

  if (params.pageURL) contexts.add('page');
  if (params.linkURL) contexts.add('link');
  if (params.frameURL) contexts.add('frame');
  if (params.selectionText) contexts.add('selection');
  if (params.isEditable) contexts.add('editable');
  return contexts;
};

const formatTitle = (title, params) => {
  if (params.selectionText && title.includes('%s')) {
    title = title.split('%s').join(params.selectionText);
  }

  return title;
};

const matchesConditions = (props, conditions) => {
  if (props.visible === false) return false;
  const {
    contextTypes,
    targetUrl,
    documentUrl
  } = conditions;
  const contexts = props.contexts || DEFAULT_CONTEXTS;
  const inContext = contexts.some(context => contextTypes.has(context));
  if (!inContext) return false;

  if (props.targetUrlPatterns && props.targetUrlPatterns.length > 0 && targetUrl) {
    if (!props.targetUrlPatterns.some(pattern => (0,_common__WEBPACK_IMPORTED_MODULE_1__.matchesPattern)(pattern, targetUrl))) {
      return false;
    }
  }

  if (props.documentUrlPatterns && props.documentUrlPatterns.length > 0 && documentUrl) {
    if (!props.documentUrlPatterns.some(pattern => (0,_common__WEBPACK_IMPORTED_MODULE_1__.matchesPattern)(pattern, documentUrl))) {
      return false;
    }
  }

  return true;
};

class ContextMenusAPI {
  constructor(ctx) {
    this.ctx = ctx;
    this.menus = new Map();

    this.buildMenuItem = opts => {
      const {
        extension,
        props,
        webContents,
        params
      } = opts; // TODO: try to get the appropriately sized image before resizing

      let icon = opts.showIcon ? (0,_common__WEBPACK_IMPORTED_MODULE_1__.getIconImage)(extension) : undefined;

      if (icon) {
        icon = icon.resize({
          width: 16,
          height: 16
        });
      }

      const menuItemOptions = {
        id: props.id,
        type: props.type,
        label: params ? formatTitle(props.title || '', params) : props.title || '',
        icon,
        enabled: props.enabled,
        click: () => {
          this.onClicked(extension.id, props.id, webContents, params);
        }
      };
      return menuItemOptions;
    };

    this.buildMenuItemsFromTemplate = menuItemTemplates => {
      const itemMap = new Map(); // Group by ID

      for (const item of menuItemTemplates) {
        const menuItem = this.buildMenuItem(item);
        itemMap.set(item.props.id, menuItem);
      } // Organize in tree


      for (const item of menuItemTemplates) {
        const menuItem = itemMap.get(item.props.id);

        if (item.props.parentId) {
          const parentMenuItem = itemMap.get(item.props.parentId);

          if (parentMenuItem) {
            const submenu = parentMenuItem.submenu || [];
            submenu.push(menuItem);
            parentMenuItem.submenu = submenu;
          }
        }
      }

      const menuItems = [];

      const buildFromTemplate = opts => {
        if (Array.isArray(opts.submenu)) {
          const submenu = new electron__WEBPACK_IMPORTED_MODULE_0__.Menu();
          opts.submenu.forEach(item => submenu.append(buildFromTemplate(item)));
          opts.submenu = submenu;
        }

        return new electron__WEBPACK_IMPORTED_MODULE_0__.MenuItem(opts);
      }; // Build all final MenuItems in-order


      for (const item of menuItemTemplates) {
        // Items with parents will be handled recursively
        if (item.props.parentId) continue;
        const menuItem = itemMap.get(item.props.id);
        menuItems.push(buildFromTemplate(menuItem));
      }

      return menuItems;
    };

    this.create = ({
      extension
    }, createProperties) => {
      const {
        id,
        type,
        title
      } = createProperties;

      if (this.menus.has(id)) {
        // TODO: duplicate error
        return;
      }

      if (!title && type !== 'separator') {
        // TODO: error
        return;
      }

      this.addContextItem(extension.id, createProperties);
    };

    this.remove = ({
      extension
    }, menuItemId) => {
      const items = this.menus.get(extension.id);

      if (items && items.has(menuItemId)) {
        items.delete(menuItemId);

        if (items.size === 0) {
          this.menus.delete(extension.id);
        }
      }
    };

    this.removeAll = ({
      extension
    }) => {
      this.menus.delete(extension.id);
    };

    const handle = this.ctx.router.apiHandler();
    handle('contextMenus.create', this.create);
    handle('contextMenus.remove', this.remove);
    handle('contextMenus.removeAll', this.removeAll);
    this.ctx.session.on('extension-unloaded', (event, extension) => {
      if (this.menus.has(extension.id)) {
        this.menus.delete(extension.id);
      }
    });
    this.ctx.store.buildMenuItems = this.buildMenuItemsForExtension.bind(this);
  }

  addContextItem(extensionId, props) {
    let contextItems = this.menus.get(extensionId);

    if (!contextItems) {
      contextItems = new Map();
      this.menus.set(extensionId, contextItems);
    }

    contextItems.set(props.id, props);
  }

  buildMenuItemsForParams(webContents, params) {
    if (webContents.session !== this.ctx.session) return [];
    let menuItemOptions = [];
    const conditions = {
      contextTypes: getContextTypesFromParams(params),
      targetUrl: params.srcURL || params.linkURL,
      documentUrl: params.frameURL || params.pageURL
    };

    for (const [extensionId, propItems] of this.menus) {
      const extension = this.ctx.session.getExtension(extensionId);
      if (!extension) continue;
      const extensionMenuItemOptions = [];

      for (const [, props] of propItems) {
        if (matchesConditions(props, conditions)) {
          const menuItem = {
            extension,
            props,
            webContents,
            params
          };
          extensionMenuItemOptions.push(menuItem);
        }
      }

      const topLevelItems = extensionMenuItemOptions.filter(opt => !opt.props.parentId);

      if (topLevelItems.length > 1) {
        // Create new top-level item to group children
        const groupId = `group${extension.id}`;
        const groupMenuItemOptions = {
          extension,
          webContents,
          props: {
            id: groupId,
            title: extension.name
          },
          params,
          showIcon: true
        }; // Reassign children to group item

        const children = extensionMenuItemOptions.map(opt => opt.props.parentId ? opt : { ...opt,
          props: { ...opt.props,
            parentId: groupId
          }
        });
        menuItemOptions = [...menuItemOptions, groupMenuItemOptions, ...children];
      } else if (extensionMenuItemOptions.length > 0) {
        // Set all children to show icon
        const children = extensionMenuItemOptions.map(opt => ({ ...opt,
          showIcon: true
        }));
        menuItemOptions = [...menuItemOptions, ...children];
      }
    }

    return this.buildMenuItemsFromTemplate(menuItemOptions);
  }

  buildMenuItemsForExtension(extensionId, menuType) {
    const extensionItems = this.menus.get(extensionId);
    const extension = this.ctx.session.getExtension(extensionId);
    const activeTab = this.ctx.store.getActiveTabOfCurrentWindow();
    const menuItemOptions = [];

    if (extensionItems && extension && activeTab) {
      const conditions = {
        contextTypes: new Set(['all', menuType])
      };

      for (const [, props] of extensionItems) {
        if (matchesConditions(props, conditions)) {
          const menuItem = {
            extension,
            props,
            webContents: activeTab
          };
          menuItemOptions.push(menuItem);
        }
      }
    }

    return this.buildMenuItemsFromTemplate(menuItemOptions);
  }

  onClicked(extensionId, menuItemId, webContents, params) {
    if (webContents.isDestroyed()) return;
    const tab = this.ctx.store.tabDetailsCache.get(webContents.id);

    if (!tab) {
      console.error(`[Extensions] Unable to find tab for id=${webContents.id}`);
      return;
    }

    const data = {
      selectionText: params === null || params === void 0 ? void 0 : params.selectionText,
      checked: false,
      // TODO
      menuItemId,
      frameId: -1,
      // TODO: match frameURL with webFrameMain in Electron 12
      frameUrl: params === null || params === void 0 ? void 0 : params.frameURL,
      editable: (params === null || params === void 0 ? void 0 : params.isEditable) || false,
      mediaType: params === null || params === void 0 ? void 0 : params.mediaType,
      wasChecked: false,
      // TODO
      pageUrl: params === null || params === void 0 ? void 0 : params.pageURL,
      // types are inaccurate
      linkUrl: params === null || params === void 0 ? void 0 : params.linkURL,
      parentMenuItemId: -1,
      // TODO
      srcUrl: params === null || params === void 0 ? void 0 : params.srcURL
    };
    this.ctx.router.sendEvent(extensionId, 'contextMenus.onClicked', data, tab);
  }

}

/***/ }),

/***/ "./src/browser/api/cookies.ts":
/*!************************************!*\
  !*** ./src/browser/api/cookies.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CookiesAPI: () => (/* binding */ CookiesAPI)
/* harmony export */ });
var CookieStoreID;

(function (CookieStoreID) {
  CookieStoreID["Default"] = "0";
  CookieStoreID["Incognito"] = "1";
})(CookieStoreID || (CookieStoreID = {}));

const onChangedCauseTranslation = {
  'expired-overwrite': 'expired_overwrite'
};

const createCookieDetails = cookie => ({ ...cookie,
  domain: cookie.domain || '',
  hostOnly: Boolean(cookie.hostOnly),
  session: Boolean(cookie.session),
  path: cookie.path || '',
  httpOnly: Boolean(cookie.httpOnly),
  secure: Boolean(cookie.secure),
  storeId: CookieStoreID.Default
});

class CookiesAPI {
  get cookies() {
    return this.ctx.session.cookies;
  }

  constructor(ctx) {
    this.ctx = ctx;

    this.onChanged = (event, cookie, cause, removed) => {
      const changeInfo = {
        cause: onChangedCauseTranslation[cause] || cause,
        cookie: createCookieDetails(cookie),
        removed
      };
      this.ctx.router.broadcastEvent('cookies.onChanged', changeInfo);
    };

    const handle = this.ctx.router.apiHandler();
    handle('cookies.get', this.get.bind(this));
    handle('cookies.getAll', this.getAll.bind(this));
    handle('cookies.set', this.set.bind(this));
    handle('cookies.remove', this.remove.bind(this));
    handle('cookies.getAllCookieStores', this.getAllCookieStores.bind(this));
    this.cookies.addListener('changed', this.onChanged);
  }

  async get(event, details) {
    // TODO: storeId
    const cookies = await this.cookies.get({
      url: details.url,
      name: details.name
    }); // TODO: If more than one cookie of the same name exists for the given URL,
    // the one with the longest path will be returned. For cookies with the
    // same path length, the cookie with the earliest creation time will be returned.

    return cookies.length > 0 ? createCookieDetails(cookies[0]) : null;
  }

  async getAll(event, details) {
    // TODO: storeId
    const cookies = await this.cookies.get({
      url: details.url,
      name: details.name,
      domain: details.domain,
      path: details.path,
      secure: details.secure,
      session: details.session
    });
    return cookies.map(createCookieDetails);
  }

  async set(event, details) {
    await this.cookies.set(details);
    const cookies = await this.cookies.get(details);
    return cookies.length > 0 ? createCookieDetails(cookies[0]) : null;
  }

  async remove(event, details) {
    try {
      await this.cookies.remove(details.url, details.name);
    } catch {
      return null;
    }

    return details;
  }

  async getAllCookieStores(event) {
    const tabIds = Array.from(this.ctx.store.tabs).map(tab => tab.isDestroyed() ? undefined : tab.id).filter(Boolean);
    return [{
      id: CookieStoreID.Default,
      tabIds
    }];
  }

}

/***/ }),

/***/ "./src/browser/api/i18n.ts":
/*!*********************************!*\
  !*** ./src/browser/api/i18n.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I18nAPI: () => (/* binding */ I18nAPI)
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./src/browser/api/common.ts");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_1__);


const fs = eval('require')('fs');
const path = eval('require')('path');
/**
 * Stub implementation for chrome.i18n API.
 */

class I18nAPI {
  constructor(ctx) {
    this.ctx = ctx;
    const handle = this.ctx.router.apiHandler();
    handle('i18n.getAllMessage', this.getAllMessage.bind(this));
  }

  getAllMessage(event) {
    let manifest = (0,_common__WEBPACK_IMPORTED_MODULE_0__.getExtensionManifest)(event.extension);
    let localeName = electron__WEBPACK_IMPORTED_MODULE_1__.app.getLocale().replace('-', '_');
    let localePath = (0,_common__WEBPACK_IMPORTED_MODULE_0__.resolveExtensionPath)(event.extension, '_locales');

    if (!fs.existsSync(localePath)) {
      return {};
    }

    let message = '';

    if (fs.existsSync(path.join(localePath, localeName))) {
      //如果存在语言包
      message = path.join(localePath, localeName); //存在中文语言包
    } else {
      //如果不存在语言包，直接返回
      message = path.join(localePath, manifest['default_locale']);
    }

    let file = path.join(message, 'messages.json');
    let localeJson;

    try {
      var con = fs.readFileSync(file, 'utf8');
      localeJson = JSON.parse(con.trim());
    } catch (e) {
      console.warn(e);
      localeJson = [];
    }

    return localeJson;
  }

}

/***/ }),

/***/ "./src/browser/api/notifications.ts":
/*!******************************************!*\
  !*** ./src/browser/api/notifications.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotificationsAPI: () => (/* binding */ NotificationsAPI)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common */ "./src/browser/api/common.ts");


var TemplateType;

(function (TemplateType) {
  TemplateType["Basic"] = "basic";
  TemplateType["Image"] = "image";
  TemplateType["List"] = "list";
  TemplateType["Progress"] = "progress";
})(TemplateType || (TemplateType = {}));

const getBody = opts => {
  const {
    type = TemplateType.Basic
  } = opts;

  switch (type) {
    case TemplateType.List:
      {
        if (!Array.isArray(opts.items)) {
          throw new Error('List items must be provided for list type');
        }

        return opts.items.map(item => `${item.title} - ${item.message}`).join('\n');
      }

    default:
      return opts.message || '';
  }
};

const getUrgency = priority => {
  if (typeof priority !== 'number') {
    return 'normal';
  } else if (priority >= 2) {
    return 'critical';
  } else if (priority < 0) {
    return 'low';
  } else {
    return 'normal';
  }
};

const createScopedIdentifier = (extension, id) => `${extension.id}-${id}`;

const stripScopeFromIdentifier = id => {
  const index = id.indexOf('-');
  return id.substr(index + 1);
};

class NotificationsAPI {
  constructor(ctx) {
    this.ctx = ctx;
    this.registry = new Map();

    this.clear = ({
      extension
    }, id) => {
      const notificationId = createScopedIdentifier(extension, id);

      if (this.registry.has(notificationId)) {
        var _this$registry$get;

        (_this$registry$get = this.registry.get(notificationId)) === null || _this$registry$get === void 0 ? void 0 : _this$registry$get.close();
      }
    };

    this.create = async ({
      extension
    }, arg1, arg2) => {
      let id;
      let opts;

      if (typeof arg1 === 'object') {
        id = 'guid'; // TODO: generate uuid

        opts = arg1;
      } else if (typeof arg1 === 'string') {
        id = arg1;
        opts = arg2;
      } else {
        throw new Error('Invalid arguments');
      }

      if (typeof opts !== 'object' || !opts.type || !opts.iconUrl || !opts.title || !opts.message) {
        throw new Error('Missing required notification options');
      }

      const notificationId = createScopedIdentifier(extension, id);

      if (this.registry.has(notificationId)) {
        var _this$registry$get2;

        (_this$registry$get2 = this.registry.get(notificationId)) === null || _this$registry$get2 === void 0 ? void 0 : _this$registry$get2.close();
      }

      let icon;

      if (opts.iconUrl) {
        var _url;

        let url;

        try {
          url = new URL(opts.iconUrl);
        } catch {}

        if (((_url = url) === null || _url === void 0 ? void 0 : _url.protocol) === 'data:') {
          icon = opts.iconUrl;
        } else {
          icon = await (0,_common__WEBPACK_IMPORTED_MODULE_1__.validateExtensionResource)(extension, opts.iconUrl);
        }

        if (!icon) {
          throw new Error('Invalid iconUrl');
        }
      } // TODO: buttons, template types


      const notification = new electron__WEBPACK_IMPORTED_MODULE_0__.Notification({
        title: opts.title,
        subtitle: electron__WEBPACK_IMPORTED_MODULE_0__.app.name,
        body: getBody(opts),
        silent: opts.silent,
        icon,
        urgency: getUrgency(opts.priority),
        timeoutType: opts.requireInteraction ? 'never' : 'default'
      });
      this.registry.set(notificationId, notification);
      notification.on('click', () => {
        this.ctx.router.sendEvent(extension.id, 'notifications.onClicked', id);
      });
      notification.once('close', () => {
        const byUser = true; // TODO

        this.ctx.router.sendEvent(extension.id, 'notifications.onClosed', id, byUser);
        this.registry.delete(notificationId);
      });
      notification.show();
      return id;
    };

    this.getAll = ({
      extension
    }) => {
      return Array.from(this.registry.keys()).filter(key => key.startsWith(extension.id)).map(stripScopeFromIdentifier);
    };

    this.getPermissionLevel = event => {
      return electron__WEBPACK_IMPORTED_MODULE_0__.Notification.isSupported() ? 'granted' : 'denied';
    };

    this.update = ({
      extension
    }, id, opts) => {
      const notificationId = createScopedIdentifier(extension, id);
      const notification = this.registry.get(notificationId);

      if (!notification) {
        return false;
      } // TODO: remaining opts


      if (opts.priority) notification.urgency = getUrgency(opts.priority);
      if (opts.silent) notification.silent = opts.silent;
    };

    const handle = this.ctx.router.apiHandler();
    handle('notifications.clear', this.clear);
    handle('notifications.create', this.create);
    handle('notifications.getAll', this.getAll);
    handle('notifications.getPermissionLevel', this.getPermissionLevel);
    handle('notifications.update', this.update);
    this.ctx.session.on('extension-unloaded', (event, extension) => {
      for (const [key, notification] of this.registry) {
        if (key.startsWith(extension.id)) {
          notification.close();
        }
      }
    });
  }

}

/***/ }),

/***/ "./src/browser/api/permissions.ts":
/*!****************************************!*\
  !*** ./src/browser/api/permissions.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PermissionsAPI: () => (/* binding */ PermissionsAPI)
/* harmony export */ });
/**
 * Stub implementation for chrome.commands API.
 */
class PermissionsAPI {
  constructor(ctx) {
    this.ctx = ctx;
    const handle = this.ctx.router.apiHandler();
    handle('permissions.contains', this.contains.bind(this));
  }

  async contains(event, permissions) {
    //todo 补充permissions管理实现
    return true;
  }

}

/***/ }),

/***/ "./src/browser/api/runtime.ts":
/*!************************************!*\
  !*** ./src/browser/api/runtime.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RuntimeAPI: () => (/* binding */ RuntimeAPI)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! events */ "events");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common */ "./src/browser/api/common.ts");


class RuntimeAPI extends events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
  constructor(ctx) {
    super();
    this.ctx = ctx;

    this.openOptionsPage = async ({
      extension
    }) => {
      // TODO: options page shouldn't appear in Tabs API
      // https://developer.chrome.com/extensions/options#tabs-api
      const manifest = (0,_common__WEBPACK_IMPORTED_MODULE_1__.getExtensionManifest)(extension);

      if (manifest.options_ui) {
        // Embedded option not support (!options_ui.open_in_new_tab)
        const url = `chrome-extension://${extension.id}/${manifest.options_ui.page}`;
        await this.ctx.store.createTab({
          url,
          active: true
        });
      } else if (manifest.options_page) {
        const url = `chrome-extension://${extension.id}/${manifest.options_page}`;
        await this.ctx.store.createTab({
          url,
          active: true
        });
      }
    };

    const handle = this.ctx.router.apiHandler();
    handle('runtime.openOptionsPage', this.openOptionsPage);
  }

}

/***/ }),

/***/ "./src/browser/api/tabs.ts":
/*!*********************************!*\
  !*** ./src/browser/api/tabs.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TabsAPI: () => (/* binding */ TabsAPI)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common */ "./src/browser/api/common.ts");
/* harmony import */ var _windows__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./windows */ "./src/browser/api/windows.ts");




const debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/index.js")('electron-chrome-extensions:tabs');

const validateExtensionUrl = (url, extension) => {
  // Convert relative URLs to absolute if needed
  try {
    url = new URL(url, extension.url).href;
  } catch (e) {
    throw new Error('Invalid URL');
  } // Prevent creating chrome://kill or other debug commands


  if (url.startsWith('chrome:') || url.startsWith('javascript:')) {
    throw new Error('Invalid URL');
  }

  return url;
};

class TabsAPI {
  constructor(ctx) {
    this.ctx = ctx;
    const handle = this.ctx.router.apiHandler();
    handle('tabs.get', this.get.bind(this));
    handle('tabs.getAllInWindow', this.getAllInWindow.bind(this));
    handle('tabs.getSelected', this.getSelected.bind(this));
    handle('tabs.getCurrent', this.getCurrent.bind(this));
    handle('tabs.create', this.create.bind(this));
    handle('tabs.insertCSS', this.insertCSS.bind(this));
    handle('tabs.query', this.query.bind(this));
    handle('tabs.reload', this.reload.bind(this));
    handle('tabs.update', this.update.bind(this));
    handle('tabs.remove', this.remove.bind(this));
    handle('tabs.goForward', this.goForward.bind(this));
    handle('tabs.goBack', this.goBack.bind(this));
    this.ctx.store.on('tab-added', this.observeTab.bind(this));
  }

  observeTab(tab) {
    const tabId = tab.id;
    const updateEvents = ['page-title-updated', // title
    'did-start-loading', // status
    'did-stop-loading', // status
    'media-started-playing', // audible
    'media-paused', // audible
    'did-start-navigation', // url
    'did-redirect-navigation', // url
    'did-navigate-in-page' // url
    ];

    const updateHandler = () => {
      this.onUpdated(tabId);
    };

    updateEvents.forEach(eventName => {
      tab.on(eventName, updateHandler);
    });

    const faviconHandler = (event, favicons) => {
      ;
      tab.favicon = favicons[0];
      this.onUpdated(tabId);
    };

    tab.on('page-favicon-updated', faviconHandler);
    tab.once('destroyed', () => {
      updateEvents.forEach(eventName => {
        tab.off(eventName, updateHandler);
      });
      tab.off('page-favicon-updated', faviconHandler);
      this.ctx.store.removeTab(tab);
      this.onRemoved(tabId);
    });
    this.onCreated(tabId);
    this.onActivated(tabId);
    debug(`Observing tab[${tabId}][${tab.getType()}] ${tab.getURL()}`);
  }

  createTabDetails(tab) {
    var _win;

    const tabId = tab.id;
    const activeTab = this.ctx.store.getActiveTabFromWebContents(tab);
    let win = this.ctx.store.tabToWindow.get(tab);
    if ((_win = win) !== null && _win !== void 0 && _win.isDestroyed()) win = undefined;
    const [width = 0, height = 0] = win ? win.getSize() : [];
    const details = {
      active: (activeTab === null || activeTab === void 0 ? void 0 : activeTab.id) === tabId,
      audible: tab.isCurrentlyAudible(),
      autoDiscardable: true,
      discarded: false,
      favIconUrl: tab.favicon || undefined,
      height,
      highlighted: false,
      id: tabId,
      incognito: false,
      index: -1,
      // TODO
      mutedInfo: {
        muted: tab.audioMuted
      },
      pinned: false,
      selected: true,
      status: tab.isLoading() ? 'loading' : 'complete',
      title: tab.getTitle(),
      url: tab.getURL(),
      // TODO: tab.mainFrame.url (Electron 12)
      width,
      windowId: win ? win.id : -1
    };

    if (typeof this.ctx.store.impl.assignTabDetails === 'function') {
      this.ctx.store.impl.assignTabDetails(details, tab);
    }

    this.ctx.store.tabDetailsCache.set(tab.id, details);
    return details;
  }

  getTabDetails(tab) {
    if (this.ctx.store.tabDetailsCache.has(tab.id)) {
      return this.ctx.store.tabDetailsCache.get(tab.id);
    }

    const details = this.createTabDetails(tab);
    return details;
  }

  get(event, tabId) {
    const tab = this.ctx.store.getTabById(tabId);
    if (!tab) return {
      id: TabsAPI.TAB_ID_NONE
    };
    return this.getTabDetails(tab);
  }

  getAllInWindow(event, windowId = TabsAPI.WINDOW_ID_CURRENT) {
    if (windowId === TabsAPI.WINDOW_ID_CURRENT) windowId = this.ctx.store.lastFocusedWindowId;
    const tabs = Array.from(this.ctx.store.tabs).filter(tab => {
      if (tab.isDestroyed()) return false;
      const browserWindow = this.ctx.store.tabToWindow.get(tab);
      if (!browserWindow || browserWindow.isDestroyed()) return;
      return browserWindow.id === windowId;
    });
    return tabs.map(this.getTabDetails.bind(this));
  }

  getCurrent(event) {
    const tab = this.ctx.store.getActiveTabOfCurrentWindow();
    return tab ? this.getTabDetails(tab) : undefined;
  }

  async getSelected(event) {
    return this.query(event, {
      active: true
    })[0];
  }

  async create(event, details = {}) {
    const url = details.url ? validateExtensionUrl(details.url, event.extension) : undefined;
    const tab = await this.ctx.store.createTab({ ...details,
      url
    });
    const tabDetails = this.getTabDetails(tab);

    if (details.active) {
      queueMicrotask(() => this.onActivated(tab.id));
    }

    return tabDetails;
  }

  insertCSS(event, tabId, details) {
    const tab = this.ctx.store.getTabById(tabId);
    if (!tab) return; // TODO: move to webFrame in renderer?

    if (details.code) {
      tab.insertCSS(details.code);
    }
  }

  query(event, info = {}) {
    const isSet = value => typeof value !== 'undefined';

    const filteredTabs = Array.from(this.ctx.store.tabs).map(this.getTabDetails.bind(this)).filter(tab => {
      var _tab$mutedInfo;

      if (!tab) return false;
      if (isSet(info.active) && info.active !== tab.active) return false;
      if (isSet(info.pinned) && info.pinned !== tab.pinned) return false;
      if (isSet(info.audible) && info.audible !== tab.audible) return false;
      if (isSet(info.muted) && info.muted !== ((_tab$mutedInfo = tab.mutedInfo) === null || _tab$mutedInfo === void 0 ? void 0 : _tab$mutedInfo.muted)) return false;
      if (isSet(info.highlighted) && info.highlighted !== tab.highlighted) return false;
      if (isSet(info.discarded) && info.discarded !== tab.discarded) return false;
      if (isSet(info.autoDiscardable) && info.autoDiscardable !== tab.autoDiscardable) return false; // if (isSet(info.currentWindow)) return false
      // if (isSet(info.lastFocusedWindow)) return false

      if (isSet(info.status) && info.status !== tab.status) return false;

      if (isSet(info.title) && typeof info.title === 'string' && typeof tab.title === 'string') {
        if (!(0,_common__WEBPACK_IMPORTED_MODULE_1__.matchesTitlePattern)(info.title, tab.title)) return false;
      }

      if (isSet(info.url) && typeof tab.url === 'string') {
        if (typeof info.url === 'string' && !(0,_common__WEBPACK_IMPORTED_MODULE_1__.matchesPattern)(info.url, tab.url)) {
          return false;
        } else if (Array.isArray(info.url) && !info.url.some(pattern => (0,_common__WEBPACK_IMPORTED_MODULE_1__.matchesPattern)(pattern, tab.url))) {
          return false;
        }
      }

      if (isSet(info.windowId)) {
        if (info.windowId === TabsAPI.WINDOW_ID_CURRENT) {
          if (this.ctx.store.lastFocusedWindowId !== tab.windowId) return false;
        } else if (info.windowId !== tab.windowId) {
          return false;
        }
      } // if (isSet(info.windowType) && info.windowType !== tab.windowType) return false
      // if (isSet(info.index) && info.index !== tab.index) return false


      return true;
    }).map((tab, index) => {
      if (tab) {
        tab.index = index;
      }

      return tab;
    });
    return filteredTabs;
  }

  reload(event, arg1, arg2) {
    const tabId = typeof arg1 === 'number' ? arg1 : undefined;
    const reloadProperties = typeof arg1 === 'object' ? arg1 : typeof arg2 === 'object' ? arg2 : {};
    const tab = tabId ? this.ctx.store.getTabById(tabId) : this.ctx.store.getActiveTabOfCurrentWindow();
    if (!tab) return;

    if (reloadProperties !== null && reloadProperties !== void 0 && reloadProperties.bypassCache) {
      tab.reloadIgnoringCache();
    } else {
      tab.reload();
    }
  }

  async update(event, arg1, arg2) {
    let tabId = typeof arg1 === 'number' ? arg1 : undefined;
    const updateProperties = (typeof arg1 === 'object' ? arg1 : arg2) || {};
    const tab = tabId ? this.ctx.store.getTabById(tabId) : this.ctx.store.getActiveTabOfCurrentWindow();
    if (!tab) return;
    tabId = tab.id;
    const props = updateProperties;
    const url = props.url ? validateExtensionUrl(props.url, event.extension) : undefined;
    if (url) await tab.loadURL(url);
    if (typeof props.muted === 'boolean') tab.setAudioMuted(props.muted);
    if (props.active) this.onActivated(tabId);
    this.onUpdated(tabId);
    return this.createTabDetails(tab);
  }

  remove(event, id) {
    const ids = Array.isArray(id) ? id : [id];
    ids.forEach(tabId => {
      const tab = this.ctx.store.getTabById(tabId);
      if (tab) this.ctx.store.removeTab(tab);
      this.onRemoved(tabId);
    });
  }

  goForward(event, arg1) {
    const tabId = typeof arg1 === 'number' ? arg1 : undefined;
    const tab = tabId ? this.ctx.store.getTabById(tabId) : this.ctx.store.getActiveTabOfCurrentWindow();
    if (!tab) return;
    tab.goForward();
  }

  goBack(event, arg1) {
    const tabId = typeof arg1 === 'number' ? arg1 : undefined;
    const tab = tabId ? this.ctx.store.getTabById(tabId) : this.ctx.store.getActiveTabOfCurrentWindow();
    if (!tab) return;
    tab.goBack();
  }

  onCreated(tabId) {
    const tab = this.ctx.store.getTabById(tabId);
    if (!tab) return;
    const tabDetails = this.getTabDetails(tab);
    this.ctx.router.broadcastEvent('tabs.onCreated', tabDetails);
  }

  onUpdated(tabId) {
    const tab = this.ctx.store.getTabById(tabId);
    if (!tab) return;
    let prevDetails;

    if (this.ctx.store.tabDetailsCache.has(tab.id)) {
      prevDetails = this.ctx.store.tabDetailsCache.get(tab.id);
    }

    if (!prevDetails) return;
    const details = this.createTabDetails(tab);
    const compareProps = ['status', 'url', 'pinned', 'audible', 'discarded', 'autoDiscardable', 'mutedInfo', 'favIconUrl', 'title'];
    let didUpdate = false;
    const changeInfo = {};

    for (const prop of compareProps) {
      if (details[prop] !== prevDetails[prop]) {
        ;
        changeInfo[prop] = details[prop];
        didUpdate = true;
      }
    }

    if (!didUpdate) return;
    this.ctx.router.broadcastEvent('tabs.onUpdated', tab.id, changeInfo, details);
  }

  onRemoved(tabId) {
    const details = this.ctx.store.tabDetailsCache.has(tabId) ? this.ctx.store.tabDetailsCache.get(tabId) : null;
    this.ctx.store.tabDetailsCache.delete(tabId);
    const windowId = details ? details.windowId : _windows__WEBPACK_IMPORTED_MODULE_2__.WindowsAPI.WINDOW_ID_NONE;
    const win = typeof windowId !== 'undefined' && windowId > -1 ? electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow.getAllWindows().find(win => win.id === windowId) : null;
    this.ctx.router.broadcastEvent('tabs.onRemoved', tabId, {
      windowId,
      isWindowClosing: win ? win.isDestroyed() : false
    });
  }

  onActivated(tabId) {
    const tab = this.ctx.store.getTabById(tabId);
    if (!tab) return;
    const activeTab = this.ctx.store.getActiveTabFromWebContents(tab);
    const activeChanged = (activeTab === null || activeTab === void 0 ? void 0 : activeTab.id) !== tabId;
    if (!activeChanged) return;
    const win = this.ctx.store.tabToWindow.get(tab);
    this.ctx.store.setActiveTab(tab); // invalidate cache since 'active' has changed

    this.ctx.store.tabDetailsCache.forEach((tabInfo, cacheTabId) => {
      tabInfo.active = tabId === cacheTabId;
    });
    this.ctx.router.broadcastEvent('tabs.onActivated', {
      tabId,
      windowId: win === null || win === void 0 ? void 0 : win.id
    });
  }

}
TabsAPI.TAB_ID_NONE = -1;
TabsAPI.WINDOW_ID_NONE = -1;
TabsAPI.WINDOW_ID_CURRENT = -2;

/***/ }),

/***/ "./src/browser/api/web-navigation.ts":
/*!*******************************************!*\
  !*** ./src/browser/api/web-navigation.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WebNavigationAPI: () => (/* binding */ WebNavigationAPI)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);


const debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/index.js")('electron-chrome-extensions:webNavigation'); // https://github.com/electron/electron/pull/25464


const getFrame = (frameProcessId, frameRoutingId) => {
  return "webFrameMain" in electron__WEBPACK_IMPORTED_MODULE_0__ && electron__WEBPACK_IMPORTED_MODULE_0__.webFrameMain.fromId(frameProcessId, frameRoutingId) || null;
};

const getFrameId = frame => "webFrameMain" in electron__WEBPACK_IMPORTED_MODULE_0__ ? frame === frame.top ? 0 : frame.frameTreeNodeId : -1;

const getParentFrameId = frame => {
  const parentFrame = frame === null || frame === void 0 ? void 0 : frame.parent;
  return parentFrame ? getFrameId(parentFrame) : -1;
};

const getFrameDetails = frame => ({
  errorOccurred: false,
  // TODO
  processId: frame.processId,
  frameId: getFrameId(frame),
  parentFrameId: getParentFrameId(frame),
  url: frame.url
});

class WebNavigationAPI {
  constructor(ctx) {
    this.ctx = ctx;

    this.sendNavigationEvent = (eventName, details) => {
      debug(`${eventName} [url: ${details.url}]`);
      this.ctx.router.broadcastEvent(`webNavigation.${eventName}`, details);
    };

    this.onCreatedNavigationTarget = (tab, event, ...args) => {
      // Defaults for backwards compat prior to electron@25.0.0
      const {
        url = args[0],
        frame = getFrame(args[3], args[4])
      } = event;
      const details = {
        sourceTabId: tab.id,
        sourceProcessId: frame ? frame.processId : -1,
        sourceFrameId: getFrameId(frame),
        url,
        tabId: tab.id,
        timeStamp: Date.now()
      };
      this.sendNavigationEvent('onCreatedNavigationTarget', details);
    };

    this.onBeforeNavigate = (tab, event, ...args) => {
      // Defaults for backwards compat prior to electron@25.0.0
      const {
        url = args[0],
        isSameDocument = args[1],
        frame = getFrame(args[3], args[4])
      } = event;
      if (isSameDocument) return;
      const details = {
        frameId: getFrameId(frame),
        parentFrameId: getParentFrameId(frame),
        processId: frame ? frame.processId : -1,
        tabId: tab.id,
        timeStamp: Date.now(),
        url
      };
      this.sendNavigationEvent('onBeforeNavigate', details);
    };

    this.onCommitted = (tab, event, url, httpResponseCode, httpStatusText, isMainFrame, frameProcessId, frameRoutingId) => {
      const frame = getFrame(frameProcessId, frameRoutingId);
      const details = {
        frameId: getFrameId(frame),
        parentFrameId: getParentFrameId(frame),
        processId: frameProcessId,
        tabId: tab.id,
        timeStamp: Date.now(),
        url
      };
      this.sendNavigationEvent('onCommitted', details);
    };

    this.onHistoryStateUpdated = (tab, event, url, isMainFrame, frameProcessId, frameRoutingId) => {
      const frame = getFrame(frameProcessId, frameRoutingId);
      const details = {
        transitionType: '',
        // TODO
        transitionQualifiers: [],
        // TODO
        frameId: getFrameId(frame),
        parentFrameId: getParentFrameId(frame),
        processId: frameProcessId,
        tabId: tab.id,
        timeStamp: Date.now(),
        url
      };
      this.sendNavigationEvent('onHistoryStateUpdated', details);
    };

    this.onDOMContentLoaded = (tab, frame) => {
      const details = {
        frameId: getFrameId(frame),
        parentFrameId: getParentFrameId(frame),
        processId: frame.processId,
        tabId: tab.id,
        timeStamp: Date.now(),
        url: frame.url
      };
      this.sendNavigationEvent('onDOMContentLoaded', details);

      if (!tab.isLoadingMainFrame()) {
        this.sendNavigationEvent('onCompleted', details);
      }
    };

    this.onFinishLoad = (tab, event, isMainFrame, frameProcessId, frameRoutingId) => {
      const frame = getFrame(frameProcessId, frameRoutingId);
      const url = tab.getURL();
      const details = {
        frameId: getFrameId(frame),
        parentFrameId: getParentFrameId(frame),
        processId: frameProcessId,
        tabId: tab.id,
        timeStamp: Date.now(),
        url
      };
      this.sendNavigationEvent('onCompleted', details);
    };

    const handle = this.ctx.router.apiHandler();
    handle('webNavigation.getFrame', this.getFrame.bind(this));
    handle('webNavigation.getAllFrames', this.getAllFrames.bind(this));
    this.ctx.store.on('tab-added', this.observeTab.bind(this));
  }

  observeTab(tab) {
    tab.once('will-navigate', this.onCreatedNavigationTarget.bind(this, tab));
    tab.on('did-start-navigation', this.onBeforeNavigate.bind(this, tab));
    tab.on('did-frame-finish-load', this.onFinishLoad.bind(this, tab));
    tab.on('did-frame-navigate', this.onCommitted.bind(this, tab));
    tab.on('did-navigate-in-page', this.onHistoryStateUpdated.bind(this, tab));
    tab.on('frame-created', (e, {
      frame
    }) => {
      if (frame.top === frame) return;
      frame.on('dom-ready', () => {
        this.onDOMContentLoaded(tab, frame);
      });
    }); // Main frame dom-ready event

    tab.on('dom-ready', () => {
      if ('mainFrame' in tab) {
        this.onDOMContentLoaded(tab, tab.mainFrame);
      }
    });
  }

  getFrame(event, details) {
    const tab = this.ctx.store.getTabById(details.tabId);
    if (!tab) return null;
    let targetFrame;

    if (typeof details.frameId === 'number') {
      // https://github.com/electron/electron/pull/25464
      if ('mainFrame' in tab) {
        const mainFrame = tab.mainFrame;
        targetFrame = mainFrame.framesInSubtree.find(frame => {
          const isMainFrame = frame === frame.top;
          return isMainFrame ? details.frameId === 0 : details.frameId === frame.frameTreeNodeId;
        });
      }
    }

    return targetFrame ? getFrameDetails(targetFrame) : null;
  }

  getAllFrames(event, details) {
    const tab = this.ctx.store.getTabById(details.tabId);
    if (!tab || !('mainFrame' in tab)) return [];
    return tab.mainFrame.framesInSubtree.map(getFrameDetails);
  }

}

/***/ }),

/***/ "./src/browser/api/windows.ts":
/*!************************************!*\
  !*** ./src/browser/api/windows.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WindowsAPI: () => (/* binding */ WindowsAPI)
/* harmony export */ });
const debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/index.js")('electron-chrome-extensions:windows');

const getWindowState = win => {
  if (win.isMaximized()) return 'maximized';
  if (win.isMinimized()) return 'minimized';
  if (win.isFullScreen()) return 'fullscreen';
  return 'normal';
};

class WindowsAPI {
  constructor(ctx) {
    this.ctx = ctx;
    const handle = this.ctx.router.apiHandler();
    handle('windows.get', this.get.bind(this)); // TODO: how does getCurrent differ from getLastFocused?

    handle('windows.getCurrent', this.getLastFocused.bind(this));
    handle('windows.getLastFocused', this.getLastFocused.bind(this));
    handle('windows.getAll', this.getAll.bind(this));
    handle('windows.create', this.create.bind(this));
    handle('windows.update', this.update.bind(this));
    handle('windows.remove', this.remove.bind(this));
    this.ctx.store.on('window-added', this.observeWindow.bind(this));
  }

  observeWindow(window) {
    const windowId = window.id;
    window.on('focus', () => {
      this.onFocusChanged(windowId);
    });
    window.once('closed', () => {
      this.ctx.store.windowDetailsCache.delete(windowId);
      this.ctx.store.removeWindow(window);
      this.onRemoved(windowId);
    });
    this.onCreated(windowId);
    debug(`Observing window[${windowId}]`);
  }

  createWindowDetails(win) {
    const details = {
      id: win.id,
      focused: win.isFocused(),
      top: win.getPosition()[1],
      left: win.getPosition()[0],
      width: win.getSize()[0],
      height: win.getSize()[1],
      tabs: Array.from(this.ctx.store.tabs).filter(tab => {
        const ownerWindow = this.ctx.store.tabToWindow.get(tab);
        return ownerWindow !== null && ownerWindow !== void 0 && ownerWindow.isDestroyed() ? false : (ownerWindow === null || ownerWindow === void 0 ? void 0 : ownerWindow.id) === win.id;
      }).map(tab => this.ctx.store.tabDetailsCache.get(tab.id)).filter(Boolean),
      incognito: !win.webContents.session.isPersistent(),
      type: 'normal',
      // TODO
      state: getWindowState(win),
      alwaysOnTop: win.isAlwaysOnTop(),
      sessionId: 'default' // TODO

    };
    this.ctx.store.windowDetailsCache.set(win.id, details);
    return details;
  }

  getWindowDetails(win) {
    if (this.ctx.store.windowDetailsCache.has(win.id)) {
      return this.ctx.store.windowDetailsCache.get(win.id);
    }

    const details = this.createWindowDetails(win);
    return details;
  }

  getWindowFromId(id) {
    if (id === WindowsAPI.WINDOW_ID_CURRENT) {
      return this.ctx.store.getCurrentWindow();
    } else {
      return this.ctx.store.getWindowById(id);
    }
  }

  get(event, windowId) {
    const win = this.getWindowFromId(windowId);
    if (!win) return {
      id: WindowsAPI.WINDOW_ID_NONE
    };
    return this.getWindowDetails(win);
  }

  getLastFocused(event) {
    const win = this.ctx.store.getLastFocusedWindow();
    return win ? this.getWindowDetails(win) : null;
  }

  getAll(event) {
    return Array.from(this.ctx.store.windows).map(this.getWindowDetails.bind(this));
  }

  async create(event, details) {
    const win = await this.ctx.store.createWindow(event, details);
    return this.getWindowDetails(win);
  }

  async update(event, windowId, updateProperties = {}) {
    const win = this.getWindowFromId(windowId);
    if (!win) return;
    const props = updateProperties;

    if (props.state) {
      switch (props.state) {
        case 'maximized':
          win.maximize();
          break;

        case 'minimized':
          win.minimize();
          break;

        case 'normal':
          {
            if (win.isMinimized() || win.isMaximized()) {
              win.restore();
            }

            break;
          }
      }
    }

    return this.createWindowDetails(win);
  }

  async remove(event, windowId = WindowsAPI.WINDOW_ID_CURRENT) {
    const win = this.getWindowFromId(windowId);
    if (!win) return;
    const removedWindowId = win.id;
    await this.ctx.store.removeWindow(win);
    this.onRemoved(removedWindowId);
  }

  onCreated(windowId) {
    const window = this.ctx.store.getWindowById(windowId);
    if (!window) return;
    const windowDetails = this.getWindowDetails(window);
    this.ctx.router.broadcastEvent('windows.onCreated', windowDetails);
  }

  onRemoved(windowId) {
    this.ctx.router.broadcastEvent('windows.onRemoved', windowId);
  }

  onFocusChanged(windowId) {
    if (this.ctx.store.lastFocusedWindowId === windowId) return;
    this.ctx.store.lastFocusedWindowId = windowId;
    this.ctx.router.broadcastEvent('windows.onFocusChanged', windowId);
  }

}
WindowsAPI.WINDOW_ID_NONE = -1;
WindowsAPI.WINDOW_ID_CURRENT = -2;

/***/ }),

/***/ "./src/browser/index.ts":
/*!******************************!*\
  !*** ./src/browser/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ElectronChromeExtensions: () => (/* binding */ ElectronChromeExtensions),
/* harmony export */   Extensions: () => (/* binding */ Extensions)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! events */ "events");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _api_browser_action__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./api/browser-action */ "./src/browser/api/browser-action.ts");
/* harmony import */ var _api_tabs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./api/tabs */ "./src/browser/api/tabs.ts");
/* harmony import */ var _api_windows__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./api/windows */ "./src/browser/api/windows.ts");
/* harmony import */ var _api_web_navigation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./api/web-navigation */ "./src/browser/api/web-navigation.ts");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./store */ "./src/browser/store.ts");
/* harmony import */ var _api_context_menus__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./api/context-menus */ "./src/browser/api/context-menus.ts");
/* harmony import */ var _api_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./api/runtime */ "./src/browser/api/runtime.ts");
/* harmony import */ var _api_cookies__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./api/cookies */ "./src/browser/api/cookies.ts");
/* harmony import */ var _api_notifications__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./api/notifications */ "./src/browser/api/notifications.ts");
/* harmony import */ var _api_commands__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./api/commands */ "./src/browser/api/commands.ts");
/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./router */ "./src/browser/router.ts");
/* harmony import */ var _api_permissions__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./api/permissions */ "./src/browser/api/permissions.ts");
/* harmony import */ var _api_i18n__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./api/i18n */ "./src/browser/api/i18n.ts");

















const sessionMap = new WeakMap();
/**
 * Provides an implementation of various Chrome extension APIs to a session.
 */

class ElectronChromeExtensions extends events__WEBPACK_IMPORTED_MODULE_1__.EventEmitter {
  /** Retrieve an instance of this class associated with the given session. */
  static fromSession(session) {
    return sessionMap.get(session);
  }

  constructor(opts) {
    super();
    this.ctx = void 0;
    this.modulePath = void 0;
    this.api = void 0;
    const {
      session = electron__WEBPACK_IMPORTED_MODULE_0__.session.defaultSession,
      modulePath,
      ...impl
    } = opts || {};

    if (sessionMap.has(session)) {
      throw new Error(`Extensions instance already exists for the given session`);
    }

    sessionMap.set(session, this);
    const router = new _router__WEBPACK_IMPORTED_MODULE_14__.ExtensionRouter(session);
    const store = new _store__WEBPACK_IMPORTED_MODULE_8__.ExtensionStore(impl);
    this.ctx = {
      emit: this.emit.bind(this),
      router,
      session,
      store
    };
    this.modulePath = modulePath || path__WEBPACK_IMPORTED_MODULE_2___default().join(__dirname, '..');
    this.api = {
      browserAction: new _api_browser_action__WEBPACK_IMPORTED_MODULE_4__.BrowserActionAPI(this.ctx),
      contextMenus: new _api_context_menus__WEBPACK_IMPORTED_MODULE_9__.ContextMenusAPI(this.ctx),
      commands: new _api_commands__WEBPACK_IMPORTED_MODULE_13__.CommandsAPI(this.ctx),
      permissions: new _api_permissions__WEBPACK_IMPORTED_MODULE_15__.PermissionsAPI(this.ctx),
      i18n: new _api_i18n__WEBPACK_IMPORTED_MODULE_16__.I18nAPI(this.ctx),
      cookies: new _api_cookies__WEBPACK_IMPORTED_MODULE_11__.CookiesAPI(this.ctx),
      notifications: new _api_notifications__WEBPACK_IMPORTED_MODULE_12__.NotificationsAPI(this.ctx),
      runtime: new _api_runtime__WEBPACK_IMPORTED_MODULE_10__.RuntimeAPI(this.ctx),
      tabs: new _api_tabs__WEBPACK_IMPORTED_MODULE_5__.TabsAPI(this.ctx),
      webNavigation: new _api_web_navigation__WEBPACK_IMPORTED_MODULE_7__.WebNavigationAPI(this.ctx),
      windows: new _api_windows__WEBPACK_IMPORTED_MODULE_6__.WindowsAPI(this.ctx)
    };
    this.prependPreload();
  }

  setupProtocol(session) {
    this.api.browserAction.setupProtocol(session);
  }

  async prependPreload() {
    const {
      session
    } = this.ctx;
    let preloads = session.getPreloads();
    const preloadPath = path__WEBPACK_IMPORTED_MODULE_2___default().join(this.modulePath, 'dist/preload.js');
    const preloadIndex = preloads.indexOf(preloadPath);

    if (preloadIndex > -1) {
      preloads.splice(preloadIndex, 1);
    }

    preloads = [preloadPath, ...preloads];
    session.setPreloads(preloads);
    let preloadExists = false;

    try {
      const stat = await fs__WEBPACK_IMPORTED_MODULE_3__.promises.stat(preloadPath);
      preloadExists = stat.isFile();
    } catch {}

    if (!preloadExists) {
      console.error(`Unable to access electron-chrome-extensions preload file (${preloadPath}). Consider configuring the 'modulePath' constructor option.`);
    }
  }
  /** Add webContents to be tracked as a tab. */


  addTab(tab, window) {
    this.ctx.store.addTab(tab, window);
  }
  /** Notify extension system that the active tab has changed. */


  selectTab(tab) {
    if (this.ctx.store.tabs.has(tab)) {
      this.api.tabs.onActivated(tab.id);
    }
  }
  /**
   * Add webContents to be tracked as an extension host which will receive
   * extension events when a chrome-extension:// resource is loaded.
   *
   * This is usually reserved for extension background pages and popups, but
   * can also be used in other special cases.
   *
   * @deprecated Extension hosts are now tracked lazily when they send
   * extension IPCs to the main process.
   */


  addExtensionHost(host) {
    console.warn('ElectronChromeExtensions.addExtensionHost() is deprecated');
  }
  /**
   * Get collection of menu items managed by the `chrome.contextMenus` API.
   * @see https://developer.chrome.com/extensions/contextMenus
   */


  getContextMenuItems(webContents, params) {
    return this.api.contextMenus.buildMenuItemsForParams(webContents, params);
  }
  /**
   * Add extensions to be visible as an extension action button.
   *
   * @deprecated Not needed in Electron >=12.
   */


  addExtension(extension) {
    console.warn('ElectronChromeExtensions.addExtension() is deprecated');
    this.api.browserAction.processExtension(extension);
  }
  /**
   * Remove extensions from the list of visible extension action buttons.
   *
   * @deprecated Not needed in Electron >=12.
   */


  removeExtension(extension) {
    console.warn('ElectronChromeExtensions.removeExtension() is deprecated');
    this.api.browserAction.removeActions(extension.id);
  }

}
/**
 * @deprecated Use `ElectronChromeExtensions` instead.
 */

const Extensions = ElectronChromeExtensions;

/***/ }),

/***/ "./src/browser/popup.ts":
/*!******************************!*\
  !*** ./src/browser/popup.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PopupView: () => (/* binding */ PopupView)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);


const debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/index.js")('electron-chrome-extensions:popup');

const supportsPreferredSize = () => {
  const major = parseInt(process.versions.electron.split('.').shift() || '', 10);
  return major >= 12;
};

class PopupView {
  /** Preferred size changes are only received in Electron v12+ */
  constructor(opts) {
    this.browserWindow = void 0;
    this.parent = void 0;
    this.extensionId = void 0;
    this.anchorRect = void 0;
    this.destroyed = false;
    this.hidden = true;
    this.usingPreferredSize = supportsPreferredSize();
    this.readyPromise = void 0;

    this.destroy = () => {
      if (this.destroyed) return;
      this.destroyed = true;
      debug(`destroying ${this.extensionId}`);

      if (this.parent) {
        if (!this.parent.isDestroyed()) {
          this.parent.off('closed', this.destroy);
        }

        this.parent = undefined;
      }

      if (this.browserWindow) {
        if (!this.browserWindow.isDestroyed()) {
          const {
            webContents
          } = this.browserWindow;

          if (!webContents.isDestroyed() && webContents.isDevToolsOpened()) {
            webContents.closeDevTools();
          }

          this.browserWindow.off('closed', this.destroy);
          this.browserWindow.destroy();
        }

        this.browserWindow = undefined;
      }
    };

    this.maybeClose = () => {
      var _this$browserWindow, _this$browserWindow2;

      // Keep open if webContents is being inspected
      if (!((_this$browserWindow = this.browserWindow) !== null && _this$browserWindow !== void 0 && _this$browserWindow.isDestroyed()) && (_this$browserWindow2 = this.browserWindow) !== null && _this$browserWindow2 !== void 0 && _this$browserWindow2.webContents.isDevToolsOpened()) {
        debug('preventing close due to DevTools being open');
        return;
      } // For extension popups with a login form, the user may need to access a
      // program outside of the app. Closing the popup would then add
      // inconvenience.


      if (!electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow.getFocusedWindow()) {
        debug('preventing close due to focus residing outside of the app');
        return;
      }

      this.destroy();
    };

    this.updatePreferredSize = (event, size) => {
      debug('updatePreferredSize', size);
      this.usingPreferredSize = true;
      this.setSize(size);
      this.updatePosition(); // Wait to reveal popup until it's sized and positioned correctly

      if (this.hidden) this.show();
    };

    this.parent = opts.parent;
    this.extensionId = opts.extensionId;
    this.anchorRect = opts.anchorRect;
    this.browserWindow = new electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow({
      show: false,
      frame: false,
      parent: opts.parent,
      movable: false,
      maximizable: false,
      minimizable: false,
      resizable: false,
      skipTaskbar: true,
      backgroundColor: '#ffffff',
      webPreferences: {
        session: opts.session,
        sandbox: true,
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        contextIsolation: true,
        enablePreferredSizeMode: true
      }
    });
    const untypedWebContents = this.browserWindow.webContents;
    untypedWebContents.on('preferred-size-changed', this.updatePreferredSize);
    this.browserWindow.webContents.on('devtools-closed', this.maybeClose);
    this.browserWindow.on('blur', this.maybeClose);
    this.browserWindow.on('closed', this.destroy);
    this.parent.once('closed', this.destroy);
    this.readyPromise = this.load(opts.url);
  }

  show() {
    var _this$browserWindow3;

    this.hidden = false;
    (_this$browserWindow3 = this.browserWindow) === null || _this$browserWindow3 === void 0 ? void 0 : _this$browserWindow3.show();
  }

  async load(url) {
    const win = this.browserWindow;

    try {
      await win.webContents.loadURL(url);
    } catch (e) {
      console.error(e);
    }

    if (this.destroyed) return;

    if (this.usingPreferredSize) {
      // Set small initial size so the preferred size grows to what's needed
      this.setSize({
        width: PopupView.BOUNDS.minWidth,
        height: PopupView.BOUNDS.minHeight
      });
    } else {
      // Set large initial size to avoid overflow
      this.setSize({
        width: PopupView.BOUNDS.maxWidth,
        height: PopupView.BOUNDS.maxHeight
      }); // Wait for content and layout to load

      await new Promise(resolve => setTimeout(resolve, 100));
      if (this.destroyed) return;
      await this.queryPreferredSize();
      if (this.destroyed) return;
      this.show();
    }
  }

  isDestroyed() {
    return this.destroyed;
  }
  /** Resolves when the popup finishes loading. */


  whenReady() {
    return this.readyPromise;
  }

  setSize(rect) {
    var _this$browserWindow4;

    if (!this.browserWindow || !this.parent) return;
    const width = Math.floor(Math.min(PopupView.BOUNDS.maxWidth, Math.max(rect.width || 0, PopupView.BOUNDS.minWidth)));
    const height = Math.floor(Math.min(PopupView.BOUNDS.maxHeight, Math.max(rect.height || 0, PopupView.BOUNDS.minHeight)));
    debug(`setSize`, {
      width,
      height
    });
    (_this$browserWindow4 = this.browserWindow) === null || _this$browserWindow4 === void 0 ? void 0 : _this$browserWindow4.setBounds({ ...this.browserWindow.getBounds(),
      width,
      height
    });
  }

  updatePosition() {
    if (!this.browserWindow || !this.parent) return;
    const winBounds = this.parent.getBounds();
    const viewBounds = this.browserWindow.getBounds(); // TODO: support more orientations than just top-right

    let x = winBounds.x + this.anchorRect.x + this.anchorRect.width - viewBounds.width;
    let y = winBounds.y + this.anchorRect.y + this.anchorRect.height + PopupView.POSITION_PADDING; // Convert to ints

    x = Math.floor(x);
    y = Math.floor(y);
    debug(`updatePosition`, {
      x,
      y
    });
    this.browserWindow.setBounds({ ...this.browserWindow.getBounds(),
      x,
      y
    });
  }
  /** Backwards compat for Electron <12 */


  async queryPreferredSize() {
    if (this.usingPreferredSize || this.destroyed) return;
    const rect = await this.browserWindow.webContents.executeJavaScript(`((${() => {
      const rect = document.body.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height
      };
    }})())`);
    if (this.destroyed) return;
    this.setSize({
      width: rect.width,
      height: rect.height
    });
    this.updatePosition();
  }

}
PopupView.POSITION_PADDING = 5;
PopupView.BOUNDS = {
  minWidth: 25,
  minHeight: 25,
  maxWidth: 800,
  maxHeight: 600
};

/***/ }),

/***/ "./src/browser/router.ts":
/*!*******************************!*\
  !*** ./src/browser/router.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExtensionRouter: () => (/* binding */ ExtensionRouter)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);


const createDebug = __webpack_require__(/*! debug */ "./node_modules/debug/src/index.js"); // Shorten base64 encoded icons


const shortenValues = (k, v) => typeof v === 'string' && v.length > 128 ? v.substr(0, 128) + '...' : v;

createDebug.formatters.r = value => {
  return value ? JSON.stringify(value, shortenValues, '  ') : value;
};

const debug = createDebug('electron-chrome-extensions:router');
const DEFAULT_SESSION = '_self';
let gRoutingDelegate;
/**
 * Handles event routing IPCs and delivers them to the observer with the
 * associated session.
 */

class RoutingDelegate {
  static get() {
    return gRoutingDelegate || (gRoutingDelegate = new RoutingDelegate());
  }

  constructor() {
    this.sessionMap = new WeakMap();

    this.onRouterMessage = async (event, extensionId, handlerName, ...args) => {
      debug(`received '${handlerName}'`, args);
      const observer = this.sessionMap.get(event.sender.session);
      return observer === null || observer === void 0 ? void 0 : observer.onExtensionMessage(event, extensionId, handlerName, ...args);
    };

    this.onRemoteMessage = async (event, sessionPartition, handlerName, ...args) => {
      debug(`received remote '${handlerName}' for '${sessionPartition}'`, args);
      const ses = sessionPartition === DEFAULT_SESSION ? event.sender.session : electron__WEBPACK_IMPORTED_MODULE_0__.session.fromPartition(sessionPartition);
      const observer = this.sessionMap.get(ses);
      return observer === null || observer === void 0 ? void 0 : observer.onExtensionMessage(event, undefined, handlerName, ...args);
    };

    this.onAddListener = (event, extensionId, eventName) => {
      const observer = this.sessionMap.get(event.sender.session);
      const listener = {
        host: event.sender,
        extensionId
      };
      return observer === null || observer === void 0 ? void 0 : observer.addListener(listener, extensionId, eventName);
    };

    this.onRemoveListener = (event, extensionId, eventName) => {
      const observer = this.sessionMap.get(event.sender.session);
      const listener = {
        host: event.sender,
        extensionId
      };
      return observer === null || observer === void 0 ? void 0 : observer.removeListener(listener, extensionId, eventName);
    };

    electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.handle('crx-msg', this.onRouterMessage);
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.handle('crx-msg-remote', this.onRemoteMessage);
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.on('crx-add-listener', this.onAddListener);
    electron__WEBPACK_IMPORTED_MODULE_0__.ipcMain.on('crx-remove-listener', this.onRemoveListener);
  }

  addObserver(observer) {
    this.sessionMap.set(observer.session, observer);
  }

}

const eventListenerEquals = eventListener => other => other.host === eventListener.host && other.extensionId === eventListener.extensionId;

class ExtensionRouter {
  /**
   * Collection of all extension hosts in the session.
   *
   * Currently the router has no ability to wake up non-persistent background
   * scripts to deliver events. For now we just hold a reference to them to
   * prevent them from being terminated.
   */
  constructor(session, delegate = RoutingDelegate.get()) {
    this.session = session;
    this.delegate = delegate;
    this.handlers = new Map();
    this.listeners = new Map();
    this.extensionHosts = new Set();
    this.delegate.addObserver(this);
    session.on('extension-unloaded', (event, extension) => {
      this.filterListeners(listener => listener.extensionId !== extension.id);
    });
    electron__WEBPACK_IMPORTED_MODULE_0__.app.on('web-contents-created', (event, webContents) => {
      if (webContents.session === this.session && webContents.getType() === 'backgroundPage') {
        debug(`storing reference to background host [url:'${webContents.getURL()}']`);
        this.extensionHosts.add(webContents);
      }
    });
  }

  filterListeners(predicate) {
    for (const [eventName, listeners] of this.listeners) {
      const filteredListeners = listeners.filter(predicate);
      const delta = listeners.length - filteredListeners.length;

      if (filteredListeners.length > 0) {
        this.listeners.set(eventName, filteredListeners);
      } else {
        this.listeners.delete(eventName);
      }

      if (delta > 0) {
        debug(`removed ${delta} listener(s) for '${eventName}'`);
      }
    }
  }

  observeListenerHost(host) {
    debug(`observing listener [id:${host.id}, url:'${host.getURL()}']`);
    host.once('destroyed', () => {
      debug(`extension host destroyed [id:${host.id}]`);
      this.filterListeners(listener => listener.host !== host);
    });
  }

  addListener(listener, extensionId, eventName) {
    const {
      listeners,
      session
    } = this;
    const extension = session.getExtension(extensionId);

    if (!extension) {
      throw new Error(`extension not registered in session [extensionId:${extensionId}]`);
    }

    if (!listeners.has(eventName)) {
      listeners.set(eventName, []);
    }

    const eventListeners = listeners.get(eventName);
    const existingEventListener = eventListeners.find(eventListenerEquals(listener));

    if (existingEventListener) {
      debug(`ignoring existing '${eventName}' event listener for ${extensionId}`);
    } else {
      debug(`adding '${eventName}' event listener for ${extensionId}`);
      eventListeners.push(listener);
      this.observeListenerHost(listener.host);
    }
  }

  removeListener(listener, extensionId, eventName) {
    const {
      listeners
    } = this;
    const eventListeners = listeners.get(eventName);

    if (!eventListeners) {
      console.error(`event listener not registered for '${eventName}'`);
      return;
    }

    const index = eventListeners.findIndex(eventListenerEquals(listener));

    if (index >= 0) {
      debug(`removing '${eventName}' event listener for ${extensionId}`);
      eventListeners.splice(index, 1);
    }

    if (eventListeners.length === 0) {
      listeners.delete(eventName);
    }
  }

  getHandler(handlerName) {
    const handler = this.handlers.get(handlerName);

    if (!handler) {
      throw new Error(`${handlerName} is not a registered handler`);
    }

    return handler;
  }

  async onExtensionMessage(event, extensionId, handlerName, ...args) {
    const {
      session
    } = this;
    const {
      sender
    } = event;
    const handler = this.getHandler(handlerName);

    if (sender.session !== session && !handler.allowRemote) {
      throw new Error(`${handlerName} does not support calling from a remote session`);
    }

    const extension = extensionId ? sender.session.getExtension(extensionId) : undefined;

    if (!extension && handler.extensionContext) {
      throw new Error(`${handlerName} was sent from an unknown extension context`);
    }

    const extEvent = {
      sender,
      extension: extension
    };
    const result = await handler.callback(extEvent, ...args);
    debug(`${handlerName} result: %r`, result);
    return result;
  }

  handle(name, callback, opts) {
    this.handlers.set(name, {
      callback,
      extensionContext: typeof (opts === null || opts === void 0 ? void 0 : opts.extensionContext) === 'boolean' ? opts.extensionContext : true,
      allowRemote: typeof (opts === null || opts === void 0 ? void 0 : opts.allowRemote) === 'boolean' ? opts.allowRemote : false
    });
  }
  /** Returns a callback to register API handlers for the given context. */


  apiHandler() {
    return (name, callback, opts) => {
      this.handle(name, callback, opts);
    };
  }
  /**
   * Sends extension event to the host for the given extension ID if it
   * registered a listener for it.
   */


  sendEvent(extensionId, eventName, ...args) {
    const {
      listeners
    } = this;
    let eventListeners = listeners.get(eventName);

    if (extensionId) {
      var _eventListeners;

      // TODO: extension permissions check
      eventListeners = (_eventListeners = eventListeners) === null || _eventListeners === void 0 ? void 0 : _eventListeners.filter(el => el.extensionId === extensionId);
    }

    if (!eventListeners || eventListeners.length === 0) {
      debug(`ignoring '${eventName}' event with no listeners`);
      return;
    }

    for (const {
      host
    } of eventListeners) {
      // TODO: may need to wake lazy extension context
      if (host.isDestroyed()) {
        console.error(`Unable to send '${eventName}' to extension host for ${extensionId}`);
        continue;
      }

      const ipcName = `crx-${eventName}`;
      host.send(ipcName, ...args);
    }
  }
  /** Broadcasts extension event to all extension hosts listening for it. */


  broadcastEvent(eventName, ...args) {
    this.sendEvent(undefined, eventName, ...args);
  }

}

/***/ }),

/***/ "./src/browser/store.ts":
/*!******************************!*\
  !*** ./src/browser/store.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExtensionStore: () => (/* binding */ ExtensionStore)
/* harmony export */ });
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! events */ "events");
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_1__);



const debug = __webpack_require__(/*! debug */ "./node_modules/debug/src/index.js")('electron-chrome-extensions:store');

class ExtensionStore extends events__WEBPACK_IMPORTED_MODULE_1__.EventEmitter {
  /** Tabs observed by the extensions system. */

  /** Windows observed by the extensions system. */

  /**
   * Map of tabs to their parent window.
   *
   * It's not possible to access the parent of a BrowserView so we must manage
   * this ourselves.
   */

  /** Map of windows to their active tab. */
  constructor(impl) {
    super();
    this.impl = impl;
    this.tabs = new Set();
    this.windows = new Set();
    this.lastFocusedWindowId = void 0;
    this.tabToWindow = new WeakMap();
    this.windowToActiveTab = new WeakMap();
    this.tabDetailsCache = new Map();
    this.windowDetailsCache = new Map();
  }

  getWindowById(windowId) {
    return Array.from(this.windows).find(window => !window.isDestroyed() && window.id === windowId);
  }

  getLastFocusedWindow() {
    return this.lastFocusedWindowId ? this.getWindowById(this.lastFocusedWindowId) : null;
  }

  getCurrentWindow() {
    return this.getLastFocusedWindow();
  }

  addWindow(window) {
    if (this.windows.has(window)) return;
    this.windows.add(window);

    if (typeof this.lastFocusedWindowId !== 'number') {
      this.lastFocusedWindowId = window.id;
    }

    this.emit('window-added', window);
  }

  async createWindow(event, details) {
    if (typeof this.impl.createWindow !== 'function') {
      throw new Error('createWindow is not implemented');
    }

    const win = await this.impl.createWindow(details);
    this.addWindow(win);
    return win;
  }

  async removeWindow(window) {
    if (!this.windows.has(window)) return;
    this.windows.delete(window);

    if (typeof this.impl.removeWindow === 'function') {
      await this.impl.removeWindow(window);
    } else {
      window.destroy();
    }
  }

  getTabById(tabId) {
    return Array.from(this.tabs).find(tab => !tab.isDestroyed() && tab.id === tabId);
  }

  addTab(tab, window) {
    if (this.tabs.has(tab)) return;
    this.tabs.add(tab);
    this.tabToWindow.set(tab, window);
    this.addWindow(window);
    const activeTab = this.getActiveTabFromWebContents(tab);

    if (!activeTab) {
      this.setActiveTab(tab);
    }

    this.emit('tab-added', tab);
  }

  removeTab(tab) {
    if (!this.tabs.has(tab)) return;
    const tabId = tab.id;
    const win = this.tabToWindow.get(tab);
    this.tabs.delete(tab);
    this.tabToWindow.delete(tab); // TODO: clear active tab
    // Clear window if it has no remaining tabs

    const windowHasTabs = Array.from(this.tabs).find(tab => this.tabToWindow.get(tab) === win);

    if (!windowHasTabs) {
      this.windows.delete(win);
    }

    if (typeof this.impl.removeTab === 'function') {
      this.impl.removeTab(tab, win);
    }

    this.emit('tab-removed', tabId);
  }

  async createTab(details) {
    if (typeof this.impl.createTab !== 'function') {
      throw new Error('createTab is not implemented');
    } // Fallback to current window


    if (!details.windowId) {
      details.windowId = this.lastFocusedWindowId;
    }

    const result = await this.impl.createTab(details);

    if (!Array.isArray(result)) {
      throw new Error('createTab must return an array of [tab, window]');
    }

    const [tab, window] = result;

    if (typeof tab !== 'object' || !electron__WEBPACK_IMPORTED_MODULE_0__.webContents.fromId(tab.id)) {
      throw new Error('createTab must return a WebContents');
    } else if (typeof window !== 'object') {
      throw new Error('createTab must return a BrowserWindow');
    }

    this.addTab(tab, window);
    return tab;
  }

  getActiveTabFromWindow(win) {
    const activeTab = win && !win.isDestroyed() && this.windowToActiveTab.get(win);
    return activeTab && !activeTab.isDestroyed() && activeTab || undefined;
  }

  getActiveTabFromWebContents(wc) {
    const win = this.tabToWindow.get(wc) || electron__WEBPACK_IMPORTED_MODULE_0__.BrowserWindow.fromWebContents(wc);
    const activeTab = win ? this.getActiveTabFromWindow(win) : undefined;
    return activeTab;
  }

  getActiveTabOfCurrentWindow() {
    const win = this.getCurrentWindow();
    return win ? this.getActiveTabFromWindow(win) : undefined;
  }

  setActiveTab(tab) {
    const win = this.tabToWindow.get(tab);

    if (!win) {
      throw new Error('Active tab has no parent window');
    }

    const prevActiveTab = this.getActiveTabFromWebContents(tab);
    this.windowToActiveTab.set(win, tab);

    if (tab.id !== (prevActiveTab === null || prevActiveTab === void 0 ? void 0 : prevActiveTab.id)) {
      this.emit('active-tab-changed', tab, win);

      if (typeof this.impl.selectTab === 'function') {
        this.impl.selectTab(tab, win);
      }
    }
  }

  buildMenuItems(extensionId, menuType) {
    // This function is overwritten by ContextMenusAPI
    return [];
  }

}

/***/ }),

/***/ "./node_modules/debug/src/browser.js":
/*!*******************************************!*\
  !*** ./node_modules/debug/src/browser.js ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/debug/src/common.js")(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ "./node_modules/debug/src/common.js":
/*!******************************************!*\
  !*** ./node_modules/debug/src/common.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __webpack_require__(/*! ms */ "./node_modules/ms/index.js");
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ "./node_modules/debug/src/index.js":
/*!*****************************************!*\
  !*** ./node_modules/debug/src/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __webpack_require__(/*! ./browser.js */ "./node_modules/debug/src/browser.js");
} else {
	module.exports = __webpack_require__(/*! ./node.js */ "./node_modules/debug/src/node.js");
}


/***/ }),

/***/ "./node_modules/debug/src/node.js":
/*!****************************************!*\
  !*** ./node_modules/debug/src/node.js ***!
  \****************************************/
/***/ ((module, exports, __webpack_require__) => {

/**
 * Module dependencies.
 */

const tty = __webpack_require__(/*! tty */ "tty");
const util = __webpack_require__(/*! util */ "util");

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __webpack_require__(/*! supports-color */ "./node_modules/supports-color/index.js");

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __webpack_require__(/*! ./common */ "./node_modules/debug/src/common.js")(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ "./node_modules/has-flag/index.js":
/*!****************************************!*\
  !*** ./node_modules/has-flag/index.js ***!
  \****************************************/
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ "./node_modules/ms/index.js":
/*!**********************************!*\
  !*** ./node_modules/ms/index.js ***!
  \**********************************/
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ "./node_modules/supports-color/index.js":
/*!**********************************************!*\
  !*** ./node_modules/supports-color/index.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const os = __webpack_require__(/*! os */ "os");
const tty = __webpack_require__(/*! tty */ "tty");
const hasFlag = __webpack_require__(/*! has-flag */ "./node_modules/has-flag/index.js");

const {env} = process;

let flagForceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	flagForceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	flagForceColor = 1;
}

function envForceColor() {
	if ('FORCE_COLOR' in env) {
		if (env.FORCE_COLOR === 'true') {
			return 1;
		}

		if (env.FORCE_COLOR === 'false') {
			return 0;
		}

		return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, {streamIsTTY, sniffFlags = true} = {}) {
	const noFlagForceColor = envForceColor();
	if (noFlagForceColor !== undefined) {
		flagForceColor = noFlagForceColor;
	}

	const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;

	if (forceColor === 0) {
		return 0;
	}

	if (sniffFlags) {
		if (hasFlag('color=16m') ||
			hasFlag('color=full') ||
			hasFlag('color=truecolor')) {
			return 3;
		}

		if (hasFlag('color=256')) {
			return 2;
		}
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE', 'DRONE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = Number.parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream, options = {}) {
	const level = supportsColor(stream, {
		streamIsTTY: stream && stream.isTTY,
		...options
	});

	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel({isTTY: tty.isatty(1)}),
	stderr: getSupportLevel({isTTY: tty.isatty(2)})
};


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ElectronChromeExtensions: () => (/* reexport safe */ _browser__WEBPACK_IMPORTED_MODULE_0__.ElectronChromeExtensions),
/* harmony export */   Extensions: () => (/* reexport safe */ _browser__WEBPACK_IMPORTED_MODULE_0__.Extensions)
/* harmony export */ });
/* harmony import */ var _browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./browser */ "./src/browser/index.ts");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map