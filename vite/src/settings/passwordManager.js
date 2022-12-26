var passwordManagers = [
  {
    name: 'Built-in password manager',
    alias: '内置密码库',
    summary:'浏览器内置密码库，保存在浏览器中。<br>一旦浏览器被卸载，就会丢失全部密码。<br>建议更换到想天密码管理器。',
    icon:'',
    url:'https://www.apps.vip'

  },
  {
    name: 'file',
    alias: '想天轻密码',
    icon:'/kee/kee.svg',
    summary:'独立应用版密码管理器，使用Keepass格式存储密码库，支持密码库切换，可使用网盘进行同步。<br>推荐使用此方式。即将上线，敬请期待。',
    url:'https://www.yuque.com/tswork/browser/cahep9'
  },
  {
    name: 'Bitwarden',
    alias: 'Bitwarden',
    icon:'/kee/bitwarden.png',
    summary:'著名开源密码管理器，使用其CLI工具读写密码。',
    url:'https://bitwarden.com/'
  },
  {
    name: '1Password',
    alias: '1Password',
    icon:'/kee/1p.svg',
    summary:'著名商业密码管理器，使用其CLI工具读写密码。',
    url:'https://1password.com/zh-cn/'
  },

]
window.currentPasswordManager = null
let passwordManager = {
  init () {
    settings.listen('passwordManager', function (value) {
      if (value && value.name) {
        window.currentPasswordManager = value
      } else {
        window.currentPasswordManager = passwordManagers['Built-in password manager']
      }
    })
  }
}

export { passwordManager, passwordManagers }
