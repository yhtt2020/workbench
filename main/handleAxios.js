const axios = require(path.join(__dirname, './js/util/axios.js'))
const storage = require('electron-localstorage');
const { clipboard } = require('electron')

const handleAxios =  {
  initialize: function() {
    app.whenReady().then(()=>{
       //游览器登录
    ipc.on('loginBrowser', async (event, arg) => {
      const data = {
        code: arg
      }
      const result = await axios({
        method: 'post',
        url: `/app/loginBrowser`,
        data
      })
      if(result.code === 1000) {
        storage.setItem(`userToken`, result.data.token)
        storage.setItem(`userInfo`, result.data.userInfo)
      }
      event.reply('callback-loginBrowser', result)
    })
    //游览器登出
    ipc.on('logoutBrowser', async(event, arg) => {
      const data = {
        code: arg
      }
      await axios({
        method: 'post',
        url: `/app/logoutBrowser`,
        headers: { 'Authorization': storage.getItem(`userToken`)},
        data
      })
      storage.removeItem(`userToken`);
      storage.removeItem(`userInfo`)
    })

    //分享组
    ipc.on('shareTask', async (event, arg) => {
         console.log('shareTask')
      const data = {
        title: `${storage.getItem(`userInfo`).nickname} 在${new Date()}分享的组`,
        uid: storage.getItem(`userInfo`).uid,
        site_list: arg
      }
      const createRes = await axios({
        method: 'post',
        url: `/app/createTask`,
        data
      })
      console.log(createRes)
      if(createRes.code === 1000) {
        clipboard.writeText(createRes.data.shareTask_link)
        sidePanel.get().webContents.send('message',{type:'success',config:{content:'复制成功，已为您自动排除系统页面。'}})
      }
      })
    })

  }
}


handleAxios.initialize()
