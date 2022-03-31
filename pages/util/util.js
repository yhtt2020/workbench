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
};

module.exports = { tools };
