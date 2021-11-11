//本代码会同时被preoload.js合并进去
//也可以直接require进去(在非preload当中）
const config={
	SERVER_BASE_URL:"http://com.thisky.com",
}
// const api={
// 	'login':"/login",
// 	'home':'/'
// }

const api={

  API_URL:{
    user:{
      login:"/login", //登陆页面
      home:'/', //用户主页
      profile:'/user/info', //用户资料
      account:"/user/account-info" //账号信息
    },
    group:{
      index:"/groups", //群组

    }
  },
  getUrl(path){
    //const params=path.split('/')
    return config.SERVER_BASE_URL+path
  }

}
if(typeof module !="undefined"){ //如果不是preload中，则直接按照模块exports出去
  module.exports={config,api}
}

