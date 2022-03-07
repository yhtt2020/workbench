/* eslint-disable */
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

var tsbk = /*#__PURE__*/function () {
  //web项目中嵌入另一个第三方web项目。利用iFrame.contentWindow.postMessage解决同源策略限制
  function tsbk(config, self) {
    _classCallCheck(this, tsbk);

    this.self = self; //暂时先这样
    //微信jssdk是同一个url仅需调用一次，对于变化url的SPA的web app可在每次url变化时进行调用
    //我们设计成同一个origin仅需调用一次
    //后期给第三方应用一个接口调取jsapi_ticket（有效期7200秒，开发者必须在自己的服务全局缓存jsapi_ticket）
    //jsapi_ticket之后，就可以生成tsb-SDK权限验证的签名了
    //签名生成规则如下：参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（第三方开发商网站的Origin）
    //对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string
    //对string进行sha1签名，得到signature

    this.accessKey = config.accessKey;
  }

  _createClass(tsbk, null, [{
    key: "config",
    value: //options中必须要的属性 appId:必填，三方应用唯一标识 、timestamp:必填，生成签名的时间戳、 nonceStr: 必填，生成签名的随机串、 signature:必填，签名、 jsApiList:[]必填，需要使用的JS接口列表
    function config(options) {
      if (Object.keys(tsbk.secretInfo).length > 0) {
        return new Promise(function (resolve, reject) {
          window.postMessage({
            eventName: "checkAuth",
            secretInfo: tsbk.secretInfo
          }, "".concat(window.origin));
          tsbk.listener(resolve, reject);
        });
      } else {
        var keyNames = Object.keys(options);

        for (var i = 0; i < keyNames.length; i++) {
          tsbk.secretInfo[keyNames[i]] = options[keyNames[i]];
        }
      }
    }
  }, {
    key: "listener",
    value: function listener(observe, reverse) {
      window.addEventListener("message", function (e) {
        var messageEvent = e.data.eventName;

        switch (messageEvent) {
          case "authResult":
            if (tsbk.secretInfo.signature === e.data.signature) {
              tsbk.sdkSwitch = e.data.sdkSwitch;
              observe(tsbk.sdkSwitch);
            } else {
              tsbk.sdkSwitch = false;
              reverse({
                code: 401,
                msg: "SDK接口鉴权失败"
              });
            }

            break;
        }
      });
    }
  }, {
    key: "ready",
    value: function ready(fn) {
      tsbk.config().then(function (res) {
        fn();
      });
      window.addEventListener("message", function (e) {
        var channel = e.data.eventName;
        var args = e.data.args;

        if (channel) {
          tsbk.events.forEach(function (event) {
            if (channel === event.event) {
              event.callBack(e, args); //console.log('---------执行回调函数绑定',e,args)
            }
          });
        }
      });
    }
  }, {
    key: "error",
    value: function error(fn) {
      tsbk.config()["catch"](function (err) {
        fn(err);
      });
    }
  }, {
    key: "hideApp",
    value: function hideApp(options) {
      if (options && tsbk.sdkSwitch) {
        window.postMessage({
          eventName: "hideApp"
        }, "".concat(window.origin));
        options.hasOwnProperty("success") ? options.success() : false;
      } else {
        if (!tsbk.sdkSwitch) {
          options.hasOwnProperty("fail") ? options.fail() : false;
          return;
        }

        window.postMessage({
          eventName: "hideApp"
        }, "".concat(window.origin));
      }
    }
  }, {
    key: "tabLinkJump",
    value: function tabLinkJump(options) {
      if (options && tsbk.sdkSwitch) {
        var _options$url;

        window.postMessage({
          eventName: "tabLinkJump",
          url: (_options$url = options.url) !== null && _options$url !== void 0 ? _options$url : ""
        });
        options.hasOwnProperty("success") ? options.success() : false;
      } else {
        options.hasOwnProperty("fail") ? options.fail() : false;
        return;
      }
    } //暂时废弃
    // static destoryApp(options) {
    //   window.postMessage(
    //     {
    //       eventName: "destoryApp",
    //     },
    //     `${window.origin}`
    //   );
    //   if (options) {
    //     if (tsbk.sdkSwitch) {
    //       options.hasOwnProperty("success") ? options.success() : false;
    //     } else {
    //       options.hasOwnProperty("fail") ? options.fail() : false;
    //     }
    //   } else {
    //     return;
    //   }
    // }

  }, {
    key: "notice",
    value: function notice(options) {
      if (options && tsbk.sdkSwitch) {
        window.postMessage({
          eventName: 'saAppNotice',
          options: options
        });
        options.hasOwnProperty("success") ? options.success() : false;
      } else {
        if (!tsbk.sdkSwitch) {
          options.hasOwnProperty("fail") ? options.fail() : false;
          return;
        }

        window.postMessage({
          eventName: 'saAppNotice',
          options: options
        });
      }
    } //登录想天内置应用的免登 //todo 未来还要单独做一套第三方应用的免登

  }, {
    key: "autoLoginSysApp",
    value: function autoLoginSysApp(options) {
      if (options && tsbk.sdkSwitch) {
        window.postMessage({
          eventName: 'autoLoginSysApp'
        });
        options.hasOwnProperty("success") ? options.success() : false;
      } else {
        if (!tsbk.sdkSwitch) {
          options.hasOwnProperty("fail") ? options.fail() : false;
          return;
        }

        window.postMessage({
          eventName: 'autoLoginSysApp'
        });
      }
    }
  }, {
    key: "on",
    value: function on(event, listener) {
      tsbk.events.push({
        event: event,
        callBack: listener
      });
    }
  }]);

  return tsbk;
}();

_defineProperty(tsbk, "events", []);

_defineProperty(tsbk, "secretInfo", {});

_defineProperty(tsbk, "sdkSwitch", false);


/******/ 	return __webpack_exports__;
/******/ })()
;
});
