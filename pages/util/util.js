const { pinyin } = require("pinyin-pro");

const tools = {
  getWindowArgs: (window) => {
    window.globalArgs = {};
    process.argv.forEach(function (arg) {
      if (arg.startsWith("--")) {
        var key = arg.split("=")[0].replace("--", "");
        var value = arg.split("=")[1];
        // if(key==='saApp'){
        //   console.log(decodeURI(value))
        //   value=JSON.parse(decodeURI(value))
        // }
        globalArgs[key] = value;
      }
    });
    if (navigator.platform === "MacIntel") {
      window.platformType = "mac";
    } else if (navigator.platform === "Win32") {
      window.platformType = "windows";
    } else {
      window.platformType = "linux";
    }
    return window;
  }, //提取域名
  getDomain: function (hostname) {
    // 去除域名里的www，根域名用同一套帐号
    let domain = hostname;
    if (domain.startsWith("www.")) {
      domain = domain.slice(4);
    }
    return domain;
  }, //提取域名
  getRootDomain: function (hostname) {
    // 去除域名里的www，根域名用同一套帐号
    let domain = tools.getDomainFromUrl(hostname);
    let domainArray = domain.split(".");
    return (
      domainArray[domainArray.length - 2] +
      "." +
      domainArray[domainArray.length - 1]
    );
  },
  getDomainFromUrl(url) {
    let domain = url.split("/"); //以“/”进行分割
    if (domain[2]) {
      domain = domain[2];
    } else {
      domain = ""; //如果url不正确就取空
    }
    domain = tools.getDomain(domain);
    return domain;
  },
  //转义 元素的innerHTML内容即为转义后的字符
  htmlEncode(str) {
    var ele = document.createElement("span");
    ele.appendChild(document.createTextNode(str));
    return ele.innerHTML;
  },

  //解析
  htmlDecode(str) {
    var ele = document.createElement("span");
    ele.innerHTML = str;
    return ele.textContent;
  },

  /**
   * @param {number} time
   * @param {string} option
   * @returns {string}
   */
  formatTime(time, option) {
    if (("" + time).length === 10) {
      time = parseInt(time) * 1000;
    } else {
      time = +time;
    }
    const d = new Date(time);
    const now = Date.now();

    const diff = (now - d) / 1000;

    if (diff < 30) {
      return "刚刚";
    } else if (diff < 3600) {
      // less 1 hour
      return Math.ceil(diff / 60) + "分钟前";
    } else if (diff < 3600 * 24) {
      return Math.ceil(diff / 3600) + "小时前";
    } else if (diff < 3600 * 24 * 2) {
      return "1天前";
    }
    if (option) {
      return parseTime(time, option);
    } else {
      return (
        d.getMonth() +
        1 +
        "月" +
        d.getDate() +
        "日" +
        d.getHours() +
        "时" +
        d.getMinutes() +
        "分"
      );
    }
  },

  /**
   * 防抖
   *
   * @param {Function} func 执行的函数
   * @param {Number} wait 防抖秒数
   * @param {Boolean} immediate  是否立即
   * @returns
   */
  debounce(func, wait, immediate = false) {
    let timeout;

    return function () {
      let context = this;
      let args = arguments;

      if (timeout) clearTimeout(timeout); // timeout 不为null
      if (immediate) {
        let callNow = !timeout; // 第一次会立即执行，以后只有事件执行后才会再次触发
        timeout = setTimeout(function () {
          timeout = null;
        }, wait);
        if (callNow) func.apply(context, args);
      } else {
        timeout = setTimeout(function () {
          func.apply(context, args);
        }, wait);
      }
    };
  },

  /**
   * 取网站域名
   * @param {String} url
   * @returns
   */
  execDomain(url) {
    let urlReg =
      /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    return urlReg.exec(url)[0];
  },

  /**
   * 升级冒泡排序
   * @param {Array} arr 数组
   * @param {String} attr 比较的属性
   * @returns
   */
  bubbleSort(arr, attr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        if (arr[j][`${attr}`] > arr[j + 1][`${attr}`]) {
          // 相邻元素两两对比
          var temp = arr[j + 1]; // 元素交换
          arr[j + 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
    return arr;
  },

  /**
   * 拼音模糊匹配
   * 支持全拼和首字母拼音的匹配
   * 1、单字拼音命中算成功（支持冗余多打的情况）
   * 2、全部中字拼音全命中算成功
   * 3、首拼按顺序命中2个及以上算成功
   * @param {String} str 被匹配对象
   * @param {String} word 匹配的拼音
   * @returns Boolean值结果
   */
  pinyinMatch(str, word) {
    //先用正则把需要匹配的中文抠出来
    //然后匹配全拼和首字母拼
    let result = false;
    if (!str.match(/[\u4e00-\u9fa5]/g)) {
      return result;
    }
    let chinese = str.match(/[\u4e00-\u9fa5]/g).join(""); //抠出的数组中字用join变字符串
    const quanPin = pinyin(chinese, { toneType: "none", type: "array" }); // 获取数组形式不带声调的拼音
    const firstPin = pinyin(chinese, {
      pattern: "first",
      toneType: "none",
      type: "array",
    }); // 获取数组形式不带音调拼音首字母

    /**
     * 简评智能匹配
     * @param {Array} arr 首字母简拼数组
     * @param {String} word 输入的内容
     * @returns
     */
     function intelligentMatch(arr, word) {
      if (word.length <= 1) return false
      if (!/^[\u4e00-\u9fa5_a-zA-Z]+$/.test(word)) return false
      let result = false
      let stop = false
      let wordArr = word.split("")

      function recur(arr1, arr2, num1, num2) {
        if (stop === false && arr2.length <= arr1.length && arr2[num2 + 1]) {
          if (arr1[num1 + 1] === arr2[num2 + 1]) {
            result = true
          } else {
            result = false
            stop = true
          }
          recur(arr1, arr2, num1 + 1, num2 + 1)
        }
      }

      let arrIndex = 0
      let arr2Index = 0
      let needToRecur = false
      for (let i = 0; i < arr.length; i++) {
        if (needToRecur) break
        for (let j = 0; j < wordArr.length; j++) {
          if (needToRecur) break
          if (wordArr[j] === arr[i] && arr[i + 1]) {
            arrIndex = i
            arr2Index = j
            needToRecur = true
          }
        }
      }

      if (needToRecur) {
        recur(arr, wordArr, arrIndex, arr2Index)
      }
      return result
    }

    quanPin.forEach((v, index) => {
      if (v === word) {
        result = true;
      } else if (quanPin.join("") === word) {
        result = true;
      } else if (
        index <= quanPin.length - 2 &&
        word.includes(v.concat(quanPin[index + 1]))
      ) {
        result = true;
      }
    });
    if (intelligentMatch(firstPin, word)) {
      result = true;
    }
    return result;
  },
};

module.exports = { tools };
