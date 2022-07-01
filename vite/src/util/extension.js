const extentsion ={
  /**
   * 将permission数组转化为中文表达
   * @param permissions
   */
  convertPermissionsToText(permissions){
    return permissions.map(p=>{
      switch (p){
        case 'activeTab':
          return '激活标签'
        case 'contextMenus':
          return '网页菜单'
        case 'storage':
          return '存储'
        case "clipboardWrite":
          return '读写剪切板'
        case 'unlimitedStorage':
          return '完全存储'
        case "notifications":
          return '消息通知'
        case 'webRequest':
          return '网络请求'
        case 'webRequestBlocking':
          return '网络请求拦截'
        case 'tabs':
          return '标签管理'
        case 'cookies':
          return 'cookies管理'
        case 'declarativeContent':
          return '声明内容'
        case '<all_urls>':
          return '全部网页'
        case 'webNavigation':
          return '网页导航'
        case 'background':
          return '后台'
        case 'pageCapture':
          return '网页截图'
        case 'printerProvider':
          return '打印'
        case 'identity':
          return '身份'
        default :
          return p
      }
    })
  },
}
export default extentsion
