const {config} =require('../../server-config.js')
const serverConfig={

	apiUrl:{
		user:{
			login:"/login",
			home:'/',
			profile:'/user/info',
			account:"/user/account-info"
		},
		group:{
			index:"/groups",

		}
	},
	getUrl(path){
		return config.serverBaseUrl+path
	}

}

const user={

}
module.exports = serverConfig
