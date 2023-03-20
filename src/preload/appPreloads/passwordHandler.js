const passwordHandler={
  getAutoFill(cb){
    const hostname = new URL(window.location.href).hostname
    let passwordModel=require('../../model/passwordModel.js')
    passwordModel.getConfiguredPasswordManager().then(async (manager) => {
      if (!manager) {
        console.warn('没有可用的密码管理器。')
        return
      }

      if (!manager.isUnlocked()) {
        await passwordModel.unlock(manager)
      }

      // 去除域名里的www，根域名用同一套帐号
      var formattedHostname = hostname
      if (formattedHostname.startsWith('www.')) {
        formattedHostname = formattedHostname.slice(4)
      }

      manager.getSuggestions(formattedHostname).then(credentials => {
        if (credentials != null) {
          cb({
            credentials,
            manager: passwordModel.getActivePasswordManager(),
            hostname
          })
        }
          // this.callAsync( 'getURL', function (err, topLevelURL) {
          //   if (err) {
          //     console.warn(err)
          //     return
          //   }
          //   var topLevelDomain = new URL(topLevelURL).hostname
          //   if (topLevelDomain.startsWith('www.')) {
          //     topLevelDomain = topLevelDomain.slice(4)
          //   }
          //   if (domain !== topLevelDomain) {
          //     console.warn("autofill isn't supported for 3rd-party frames")
          //     return
          //   }
          //   this.callAsync('sendToFrame', [frameId, 'password-autofill-match', {
          //     credentials,
          //     manager:passwordModel.getActivePasswordManager(),
          //     hostname
          //   }])
          //   if(global.passwordToFill){
          //     this.callAsync('sendToFrame',[frameId,'fill-password',{
          //       passwordToFill:global.passwordToFill
          //     }])
          //   }
          // })
          // this.callAsync( 'sendToFrame', [frameId, 'password-autofill-match', {
          //   credentials,
          //   manager:passwordModel.getActivePasswordManager(),
          //   hostname
          // }])
          // if(global.passwordToFill){
          //   this.callAsync('sendToFrame',[frameId,'fill-password',{
          //     passwordToFill:global.passwordToFill
          //   }])
          // }




          // webviews.callAsync(tab, 'sendToFrame', [frameId, 'password-autofill-match', {
          //   credentials,
          //   hostname
          // }])


      }).catch(e => {
        if(manager.name==='file' && !manager.filePath){

          //this.send('message', { type: 'error', config: { content: '使用外部密码库时，必须设置密码库。请到 设置-密码设置 中进行设置。' } })
        }else{
          console.warn('获取自动填充密码失败，失败原因',e)
          //this.send('message', { type: 'error', config: { content: '获取自动填充密码失败。' } })
        }
        console.error('Failed to get password suggestions: ' + e.message)
      })
    })
  }
}


module.exports=passwordHandler
