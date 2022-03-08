
const tools={
  getAppProtocolUrl (pkg, url) {
    return `tsb://app/redirect/?package=${pkg}&url=${url}`
  },
  getComProtocolUrl (url) {
    return tools.getAppProtocolUrl('com.thisky.com', url)
  },
  getWindowArgs: (window) => {
    window.globalArgs = {}
    process.argv.forEach(function (arg) {
      if (arg.startsWith('--')) {
        var key = arg.split('=')[0].replace('--', '')
        var value = arg.split('=')[1]
        // if(key==='saApp'){
        //   console.log(decodeURI(value))
        //   value=JSON.parse(decodeURI(value))
        // }
        globalArgs[key] = value
      }
    })
    if (navigator.platform === 'MacIntel') {
      window.platformType = 'mac'
    } else if (navigator.platform === 'Win32') {
      window.platformType = 'windows'
    } else {
      window.platformType = 'linux'
    }
    return window
  }
  ,//提取域名
  getDomain: function (hostname) {
    // 去除域名里的www，根域名用同一套帐号
    let domain = hostname
    if (domain.startsWith('www.')) {
      domain = domain.slice(4)
    }
    return domain
  },//提取域名
  getRootDomain: function (hostname) {
    // 去除域名里的www，根域名用同一套帐号
    let domain = tools.getDomainFromUrl(hostname)
    let domainArray = domain.split('.')
    return domainArray[domainArray.length - 2] + '.' + domainArray[domainArray.length - 1]
  },
  getDomainFromUrl (url) {
    let domain = url.split('/') //以“/”进行分割
    if (domain[2]) {
      domain = domain[2]
    } else {
      domain = '' //如果url不正确就取空
    }
    domain = tools.getDomain(domain)
    return domain
  },
  //转义 元素的innerHTML内容即为转义后的字符
  htmlEncode (str) {
    var ele = document.createElement('span')
    ele.appendChild(document.createTextNode(str))
    return ele.innerHTML
  },

  //解析
  htmlDecode (str) {
    var ele = document.createElement('span')
    ele.innerHTML = str
    return ele.textContent
  }
}

export default tools
