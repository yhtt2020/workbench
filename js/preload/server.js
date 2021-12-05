//这个预载入文件用于与服务器进行交互，仅适用于项目路径
let href = window.location.href
const server = { //服务主脚本
	init(path) {
		switch (path) {
      case api.getProdNodeUrl(api.NODE_API_URL.user.code):
        this.login()
        break
      case api.getDevNodeUrl(api.NODE_API_URL.user.code):
        this.login()
        break
      default:
        console.log('在server网站下，但未命中任何预加载处理路径：'+path)
		}
	},
	login() {
    if(window.location.href.includes('code=')) {
      const code = server.matchIntercept(window.location.href, 'code', '\\&')
      ipc.send('loginBrowser', code)
      ipc.on('callback-loginBrowser', (event, arg) => {
        if(arg.code === 1000 ) {
          ipc.send('userLogin', arg.data)
          window.location.href = api.getUrl(api.API_URL.group.index)
        } else {
          console.log(arg.message)
          window.location.href = api.getUrl(api.API_URL.user.login)
        }
      })
    }
	},
  /**
   * 正则匹配标记之间的内容，进一次，特殊字符请添加\\
   * @param {String} url
   * @param {String} start
   * @param {String} end
   */
  matchIntercept(url, start, end) {
    //不加g就不会在第一个匹配时就停止，\S：匹配任何非空白字符，*：多次
    const reg = new RegExp(start + "\\=(\\S*)" + end)
    return url.match(reg)[1]
  }
}

if(href.startsWith(config.SERVER_BASE_URL))
{
  server.init(href)
} else if (href.startsWith(config.DEV_NODE_SERVER_BASE_URL)) {
  const newUrl = window.location.origin + window.location.pathname
  server.init(newUrl)
} else if (href.startsWith(config.PROD_NODE_SERVER_BASE_URL)) {
  const newUrl = window.location.origin + window.location.pathname
  server.init(newUrl)
}


