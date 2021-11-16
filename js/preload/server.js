//这个预载入文件用于与服务器进行交互，仅适用于项目路径
const config = {
	serverBaseUrl: "http://pc2ys.mark.opensns.cn",
}
const api = {
	'login': "/login",
	'home': '/'
}

let href = window.location.href
const {ipcRenderer} = require('electron')


const server = { //服务主脚本
	init(path) {
		switch (path) {
			case api.login:
				this.login()
				break
			case api.home:
				this.home()
		}


	},
	login() {
		console.log('注入登录页面脚本')
		//alert('来到登录页面')
		
	},
	home(){
		document.onreadystatechange = () => {
		  if (document.readyState === 'complete') {
		    if(localStorage.getItem('hasLogin')=='true' ){
				let userInfo=localStorage.getItem('userInfo')
				ipc.send('userLogin',{'userInfo':userInfo})//回传登录信息给主界面
			}
		  }
		}
		
	}
}




//const {config,api}=require('../server-config.js')
if (href == config.serverBaseUrl + api.login) {
	server.init(api.login)
}
if(href==config.serverBaseUrl + api.home){
	server.init(api.home)
}
console.log(ipc)
