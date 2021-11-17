//这个预载入文件用于与服务器进行交互，仅适用于项目路径
let href = window.location.href
const server = { //服务主脚本
	init(path) {
		switch (path) {
			case api.getUrl(api.API_URL.user.login):
        this.test()
				break
			// case api.getUrl(api.API_URL.user.home):
			// 	this.home()
      //   break
      case api.getNodeUrl(api.NODE_API_URL.user.code):
        this.login()
        break
      default:
        console.log('在server网站下，但未命中任何预加载处理路径：'+path)
		}
	},
  async test() {
    console.log('测试中。。。')
    ipc.send('test')
  },
	login() {
    console.log(window.location.href)
    if(window.location.href.includes('code=')) {
      //不加g就不会在第一个匹配时就停止，\S：匹配任何非空白字符，*：多次
      const code = window.location.href.match(/code\=(\S*)\&/)[1]
      ipc.send('loginB', code)
      ipc.on('callback-loginB', (event, arg) => {
        if(arg.code === 1000 ) {
          console.log(arg)
          ipc.send('userLogin', arg.data)
        } else {
          console.log(arg.message)
        }
      })
    }
	},
	home(){
    console.log('运行在想天浏览器中，home页')
		document.onreadystatechange = () => {
		  if (document.readyState === 'complete') {
		    if(localStorage.getItem('hasLogin')=='true' ){
				let userInfo=localStorage.getItem('userInfo')
				ipc.send('userLogin',{'userInfo':userInfo})//回传登录信息给主界面
			}
		  }
		}
	},
  handleUrl(url) {
    //把authorizeCode后面的部分全部去掉
    return url.replace(/\?code.*$/, '')
  }
}

if(href.startsWith(config.SERVER_BASE_URL))
{
  server.init(href)
} else if (href.startsWith(config.NODE_SERVER_BASE_URL)) {
  const newUrl = server.handleUrl(href)
  server.init(newUrl)
}


