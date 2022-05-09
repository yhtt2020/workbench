(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["tsbk"] = factory();
	else
		root["tsbk"] = factory();
})(this, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
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
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ tsbk)
/* harmony export */ });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EventBus = /*#__PURE__*/function () {
  function EventBus() {
    var _this = this;

    _classCallCheck(this, EventBus);

    _defineProperty(this, "id", 0);

    _defineProperty(this, "events", new Map());

    var handler = function handler(event) {
      var channel = event.data.eventName;

      if (channel && channel.startsWith('tsReply')) {
        var callback = _this.events.get(event.data.id);

        if (!callback) return;
        event.data.resInfo.code === 500 ? callback(null, event.data.resInfo) : callback(event.data.resInfo);

        _this.events["delete"](event.data.id);
      } else if (channel === 'errorSys') {
        var _callback = _this.events.get(event.data.id);

        if (!_callback) return;

        _callback(null, event.data.errorInfo);

        _this.events["delete"](event.data.id);
      } else if (channel === 'authResult') {
        var _callback2 = _this.events.get(event.data.id);

        if (!_callback2) return;

        _callback2(event.data.auth); //if 有真正的鉴权，判断auth返回是否是一个true，不是的话callback(event.data.auth)回调返回的就是一个false


        _this.events["delete"](event.data.id);
      }
    };

    window.addEventListener('message', handler);
  }

  _createClass(EventBus, [{
    key: "dispatch",
    value: function dispatch(eventName, callBack, options) {
      this.id += 1;
      this.events.set(this.id, callBack);

      if (eventName === 'checkAuth') {
        window.postMessage({
          eventName: eventName,
          id: this.id,
          secretInfo: tsbk.secretInfo
        });
        return;
      }

      window.postMessage({
        eventName: eventName,
        id: this.id,
        options: options
      });
    }
  }]);

  return EventBus;
}();

var eventBus = new EventBus();

var tsbk = /*#__PURE__*/function () {
  function tsbk(config, self) {
    _classCallCheck(this, tsbk);

    this.self = self;
    this.accessKey = config.accessKey; //web项目中嵌入另一个第三方web项目。利用iFrame.contentWindow.postMessage解决同源策略限制
    //暂时先这样 微信jssdk是同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用
    //我们设计成同一个origin仅需调用一次
    //后期给第三方应用一个接口调取jsapi_ticket（有效期7200秒，开发者必须在自己的服务全局缓存jsapi_ticket）
    //jsapi_ticket之后，就可以生成tsb-SDK权限验证的签名了
    //签名生成规则如下：参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（第三方开发商网站的Origin）
    //对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string
    //对string进行sha1签名，得到signature
  }

  _createClass(tsbk, null, [{
    key: "config",
    value: //options中必须要的属性 appId:必填，三方应用唯一标识 、timestamp:必填，生成签名的时间戳、 nonceStr: 必填，生成签名的随机串、 signature:必填，签名、 jsApiList:[]必填，需要使用的JS接口列表
    function config(options) {
      if (Object.keys(tsbk.secretInfo).length === 0) {
        if (!options || toString.call(options) !== '[object Object]' || Object.keys(options).length === 0) return Promise.reject({
          code: 401,
          msg: "SDK接口鉴权失败"
        });
        tsbk.secretInfo = options;
      } else {
        return new Promise(function (resolve, reject) {
          eventBus.dispatch('checkAuth', function (res) {
            res ? resolve(res) : reject({
              code: 401,
              msg: 'SDK接口鉴权失败'
            });
          });
        });
      }
    }
    /**
     * ready准备函数，每次调用都会重新去执行config鉴权函数
     * @param {function} fn 回调函数，具体方法执行的函数
     * @param {boolean} autoRefresh 是否自动刷新续签
     */

  }, {
    key: "ready",
    value: function ready(fn) {
      var autoRefresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      tsbk.config(tsbk.secretInfo).then(function () {
        fn();
      })["catch"](function (err) {
        if (autoRefresh) {
          tsbk.newSecretInfoFunc().then(function (res2) {
            tsbk.secretInfo = res2;
            tsbk.ready(fn, true); //重新验证后直接去递归执行一次操作
          })["catch"](function (err2) {
            throw err2;
          });
        } else {
          throw err; //验证失败直接丢出错误!
        }
      });
    } //注入重新获取过期jsapi_ticket的函数方法，请返回一个完整的promise对象，内容是签名传参格式

  }, {
    key: "setNewSecretInfoFunc",
    value: function setNewSecretInfoFunc(fn) {
      tsbk.newSecretInfoFunc = fn;
    }
  }, {
    key: "hideApp",
    value: function hideApp() {
      return new Promise(function (resolve, reject) {
        eventBus.dispatch('hideApp', function (res, err) {
          res ? resolve(res) : reject(err);
        });
      });
    }
  }, {
    key: "tabLinkJump",
    value: function tabLinkJump(options) {
      return new Promise(function (resolve, reject) {
        if (Object.keys(options).length === 0) {
          reject({
            code: 400,
            msg: '参数不能为空'
          });
        }

        ;

        if (!options.hasOwnProperty("url")) {
          reject({
            code: 400,
            msg: 'url参数不存在'
          });
        }

        ;

        if (options.url.length === 0) {
          reject({
            code: 400,
            msg: 'url参数错误'
          });
        }

        ;
        eventBus.dispatch('tabLinkJump', function (res, err) {
          res ? resolve(res) : reject(err);
        }, options);
      });
    }
  }, {
    key: "notice",
    value: function notice(options) {
      return new Promise(function (resolve, reject) {
        if (!options.hasOwnProperty("title") || !options.hasOwnProperty("body") || !options.hasOwnProperty("avatar") || Object.keys(options).length === 0) {
          reject({
            code: 400,
            msg: '参数错误'
          });
        }

        ;
        eventBus.dispatch('notice', function (res, err) {
          res ? resolve(res) : reject(err);
        }, options);
      });
    } //打开内置某个应用,元社区和团队协作支持跳转具体链接(可选)

  }, {
    key: "openSysApp",
    value: function openSysApp(options) {
      return new Promise(function (resolve, reject) {
        var sysApp = [{
          appName: "团队协作",
          id: 1
        }, {
          appName: "元社区",
          id: 2
        }, {
          appName: "收藏夹",
          id: 3
        }, {
          appName: "导入助手",
          id: 4
        }];

        if (Object.keys(options).length === 0) {
          reject({
            code: 400,
            msg: '参数不能为空'
          });
        }

        ;

        if (options.url && options.url.length === 0 || !options.appName) {
          reject({
            code: 400,
            msg: 'appName参数或url参数错误'
          });
        }

        ;

        if (!sysApp.some(function (v) {
          return v.appName === options.appName;
        })) {
          reject({
            code: 400,
            msg: 'appName参数错误'
          });
        }

        ;
        var sysAppIndex = sysApp.findIndex(function (v) {
          return v.appName === options.appName;
        });
        options.saAppId = sysApp[sysAppIndex].id;
        eventBus.dispatch('openSysApp', function (res, err) {
          res ? resolve(res) : reject(err);
        }, options);
      });
    } //创建短说圈子邀请链接窗体

  }, {
    key: "openOsxInviteMember",
    value: function openOsxInviteMember(options) {
      return new Promise(function (resolve, reject) {
        if (Object.keys(options).length === 0) {
          reject({
            code: 400,
            msg: '参数不能为空'
          });
        }

        ;

        if (!options.groupId) {
          reject({
            code: 400,
            msg: 'groupId参数错误'
          });
        }

        ;
        eventBus.dispatch('openOsxInviteMember', function (res, err) {
          res ? resolve(res) : reject(err);
        }, options);
      });
    } //检测浏览器器是否已登录

  }, {
    key: "checkBrowserLogin",
    value: function checkBrowserLogin() {
      return new Promise(function (resolve, reject) {
        eventBus.dispatch('checkBrowserLogin', function (res, err) {
          res ? resolve(res) : reject(err);
        });
      });
    } //申请权限统一接口(包含授权登录code的返回)

  }, {
    key: "applyPermission",
    value: function applyPermission(options) {
      return new Promise(function (resolve, reject) {
        if (Object.keys(options).length === 0) {
          reject({
            code: 400,
            msg: '参数不能为空'
          });
        }

        if (!options.hasOwnProperty('clientId') && !options.hasOwnProperty('bindId') && !options.hasOwnProperty('appName')) {
          reject({
            code: 400,
            msg: '参数不全'
          });
        }

        if (options.clientId.length === 0) {
          reject({
            code: 400,
            msg: 'clientId参数不能为空'
          });
        }

        if (options.bindId.length === 0) {
          reject({
            code: 400,
            msg: 'bindId参数不能为空'
          });
        }

        if (options.appName.length === 0) {
          reject({
            code: 400,
            msg: 'appName参数不能为空'
          });
        }

        eventBus.dispatch('applyPermission', function (res, err) {
          res ? resolve(res) : reject(err);
        }, options);
      });
    } //主动获取用户信息

  }, {
    key: "getUserProfile",
    value: function getUserProfile() {
      return new Promise(function (resolve, reject) {
        eventBus.dispatch('getUserProfile', function (res, err) {
          res ? resolve(res) : reject(err);
        });
      });
    } //登录想天内置应用的免登

  }, {
    key: "autoLoginSysApp",
    value: function autoLoginSysApp() {
      return new Promise(function (resolve, reject) {
        eventBus.dispatch('autoLoginSysApp', function (res, err) {
          res ? resolve(res) : reject(err);
        });
      });
    } //第三方应用免登获取免登凭证

  }, {
    key: "autoLoginEntityApp",
    value: function autoLoginEntityApp(options) {
      return new Promise(function (resolve, reject) {
        if (Object.keys(options).length === 0) {
          reject({
            code: 400,
            msg: '参数不能为空'
          });
        }

        if (!options.hasOwnProperty('clientId') && !options.hasOwnProperty('bindId') && !options.hasOwnProperty('accessToken')) {
          reject({
            code: 400,
            msg: '参数不全'
          });
        }

        if (options.clientId.length === 0) {
          reject({
            code: 400,
            msg: 'clientId参数不能为空'
          });
        }

        if (options.bindId.length === 0) {
          reject({
            code: 400,
            msg: 'bindId参数不能为空'
          });
        }

        if (options.accessToken.length === 0) {
          reject({
            code: 400,
            msg: 'accessToken参数不能为空'
          });
        }

        eventBus.dispatch('autoLoginEntityApp', function (res, err) {
          res ? resolve(res) : reject(err);
        }, options);
      });
    }
  }]);

  return tsbk;
}();

_defineProperty(tsbk, "secretInfo", {});

_defineProperty(tsbk, "newSecretInfoFunc", function () {});


/******/ 	return __webpack_exports__;
/******/ })()
;
});