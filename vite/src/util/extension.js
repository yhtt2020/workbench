const path=eval('require')('path')
const fs=eval('require')('fs')
const promises=fs.promises
const extension ={
  async loadAllExtensions (dir) {
    const manifestExists = async (dirPath) => {
      if (!dirPath) return false
      const manifestPath = path.join(dirPath, 'manifest.json')
      try {
        return (fs.statSync(manifestPath)).isFile()
      } catch {
        return false
      }
    }
    console.log(dir)
    const subDirectories = fs.readdirSync(dir, {
      withFileTypes: true,
    })

    const extensionDirectories = await Promise.all(
      subDirectories
        .filter((dirEnt) => dirEnt.isDirectory())
        .map(async (dirEnt) => {
          const extPath = path.join(dir, dirEnt.name)

          if (await manifestExists(extPath)) {
            return extPath
          }

          const extSubDirs = await fs.readdirSync(extPath, {
            withFileTypes: true,
          })

          const versionDirPath =
            extSubDirs.length === 1 && extSubDirs[0].isDirectory()
              ? path.join(extPath, extSubDirs[0].name)
              : null

          if (await manifestExists(versionDirPath)) {
            return versionDirPath
          }
        })
    )
    const results = []
    for(let i=0;i<extensionDirectories.length;i++){
      results.push(await extension.loadExtension(extensionDirectories[i]))
    }
    return results
  },
  getName(manifest,extensionPath){
    const fs=eval('require')('fs')
    const path=eval('require')('path')
    let name=manifest['name']
    let cnName='zh_CN'
    let localePath=path.resolve(extensionPath,'_locales')
    if(name.startsWith('__MSG_')){
      name=name.substring(6,name.length-2)
      let messageName=''
      if(fs.existsSync(path.join(localePath,cnName)))
      {
        messageName=path.join(localePath,cnName,'messages.json')
        //存在中文语言包
      }else{
        messageName=path.join(localePath,manifest['default_locale'],'messages.json')
      }
      let locale= JSON.parse(fs.readFileSync(messageName,'utf8'))
      return locale[name]['message']
    }else{
      return name
    }
  },
  getIcon(manifest,extensionPath){
    let icons=Object.values(manifest.icons)
    return path.join(extensionPath, icons[icons.length-1])
  },
  async loadExtension (dir) {
    try {
      let manifestPath = path.join(dir, 'manifest.json')
      let extensionInfo = JSON.parse(
        await promises.readFile(manifestPath, 'utf8'),
      )
      extensionInfo.path=dir
      extensionInfo.baseName=path.basename(dir)
      extensionInfo.localeName=extension.getName(extensionInfo,dir)
      extensionInfo.displayIcon=extension.getIcon(extensionInfo,dir)
      return extensionInfo
    } catch (e) {
      return null
    }
  },
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
export default extension
