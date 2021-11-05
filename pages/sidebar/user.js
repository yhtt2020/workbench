const {config} =require('../../server-config.js')
const serverConfig={
	
	apiUrl:{
		user:{
			login:"/login",
			home:'/'
		}
	},
	getUrl(path){
		return config.serverBaseUrl+path
	}
	
}

const user={
	
}
module.exports = serverConfig