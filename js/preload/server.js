//这个预载入文件用于与服务器进行交互，仅适用于项目路径
//const axios = require('../util/axios.js')
let href = window.location.href
const server = { //服务主脚本
	init(path) {
		switch (path) {
			case api.getUrl(api.API_URL.user.login):
				//this.login()
        this.test()
				break
			case api.getUrl(api.API_URL.user.home):
				this.home()
        break
      case api.getNodeUrl(api.NODE_API_URL.user.code):
        this.login()
        break
      default:
        console.log('在server网站下，但未命中任何预加载处理路径：'+path)
		}
	},
  async test() {
    console.log('测试中。。。')
    // const result = await fetch('https://www.baidu.com', {
    //   method: 'get',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    // })
    // console.log(result)
    console.log(ipc.send('loginB'))
    ipc.on('b-loginB', (event, arg) => {
      console.log(arg)
    })

  },
	login() {
    console.log(window.location.href)
		console.log('运行在想天浏览器中，登陆页面')
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


