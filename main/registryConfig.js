// var regedit = require('regedit')
const regeditTool = {
  /**
   * @file 添加、删除注册列表的key值
   */
// eslint-disable-next-line camelcase
  child_process: require('child_process'),
//  注意：`HKEY_CURRENT_USER`可以简写为`HKCU`，在网上看到的`HKCU`也就是`HKEY_CURRENT_USER`的意思
// 默认的自启动注册列表地址
  keyPathRun: 'HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\',
  deleteKey(keyPath, value) {
    return new Promise((resolve, reject) => {
      // reg delete HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run /v electron.app.Electron /f
      regeditTool.child_process.exec(`reg delete ${keyPath} /v ${value} /f`, (error, stdout, stderr) => {
        if (error) {
          console.error(`stderr: ${stderr}`);
          reject(error);
          return;
        } else {
          console.log(`stdout: ${stdout}`);
          resolve(stdout);
        }


      });
    });
  },

// deleteKey(keyPath, 'electron.app.DuGuanjiaTray')
//     .then(() => console.log('deleteKey ok '))
//     .catch((err) => console.log('deleteKey error', err));

  addKey(keyPath, name, value, type = 'REG_SZ') {
    if (!!!type) type = 'REG_RZ'
    return new Promise((resolve, reject) => {
      // try {
      //   // eslint-disable-next-line max-len
      //   // reg add HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run /v electron.app.Electron /t REG_SZ /d hello.exe /f
      //   // reg delete HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run /v electron.app.Electron /f
      //   const result =  regeditTool.child_process.exec(`reg add ${keyPath} /v ${name} /t ${type} /d ${value} /f`);
      //   resolve(result);
      // } catch (error) {
      //   reject(error);
      // }
      let cmd=''
      if(type!=='REG_DEFAULT'){
        cmd=`reg add ${keyPath} /v "${name}" /t "${type}" /d "${value}" /f`
        console.log('即将注册:'+cmd);
        regeditTool.child_process.exec(cmd, (error, stdout, stderr) => {
          if (error) {
            console.log('注册失败:'+cmd);
            console.error(`stderr: ${stderr}`);
            reject(error);
          } else {
            console.log('注册成功:'+cmd);
            resolve(stdout);
          }
        })

      }else{
        cmd=`reg add ${keyPath} /d "${value}" /f`
        console.log('即将注册默认数值:'+cmd);
        regeditTool.child_process.exec(cmd, (error, stdout, stderr) => {
          if (error) {
            console.log('注册失败:'+cmd);
            console.error(`stderr: ${stderr}`);
            reject(error);
          } else {
            console.log(`注册成功:`+cmd);
            resolve(stdout);
          }
        })
      }

    });
  },

  addKeyList(list) {
    list.forEach(async keyValue => {
      console.log('注册')
      console.log(keyValue)
      await regeditTool.addKey(keyValue.path, keyValue.name, keyValue.value, keyValue.type).then((result) => {
        // console.log(result)
      }, (err) => {
        console.log(err)
      }).catch(e => {
        // console.log('error')
        throw e
      })
    })
  },
  deleteKeyList(list) {
    list.forEach(async keyValue => {
      console.log('注册')
      console.log(keyValue)
      await regeditTool.deleteKey(keyValue.path, keyValue.name).then((result) => {
        console.log(result)
        // console.log(result)
      }, (err) => {
        yarn
        console.log(err)
      }).catch(e => {
        // console.log('error')
        throw e
      })
    })
  },
  setDefaultBrowser(){
    let exePath=''
      if(isDevelopmentMode){
         exePath=path.join(__dirname,'/res/SetDefaultBrowser.exe')
      }else{
         exePath=path.join(path.dirname(app.getPath('exe')),'\\resources\\res\\SetDefaultBrowser.exe')
      }

    console.log('即将启用设置默认浏览器的脚本'+exePath)

    const cmd=`"${exePath}"`+' HKCU ThiskyBrowser'
    const dlog =require('electron-log')
    dlog.error(cmd)
    regeditTool.child_process.exec(cmd,(error, stdout, stderr) => {
      if (error) {
        console.log('最终设置默认浏览器gg:'+cmd);
        console.error(`stderr: ${stderr}`);
      } else {
        console.log(`最终设置默认浏览器成功:`+cmd);
      }
    })
  }
}

var installPath = process.execPath
var registryConfig = [
  {
    path: 'HKCU\\Software\\RegisteredApplications',
    name: 'ThiskyBrowser',
    value: 'Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities'
  },
  {
    path: 'HKCU\\Software\\Classes\\ThiskyBrowser',
    name: 'default',
    value: 'ThiskyBrowser Browser Document',
    type:'REG_DEFAULT'
  },
  {
    path: 'HKCU\\Software\\Classes\\ThiskyBrowser\\Application',
    name: 'ApplicationDescription',
    value: '团队工作协作浏览器'
  },
  {
    path: 'HKCU\\Software\\Classes\\ThiskyBrowser\\Application',
    name: 'ApplicationCompany',
    value: '嘉兴想天信息科技有限公司'
  },
  {
    path: 'HKCU\\Software\\Classes\\ThiskyBrowser\\Application',
    name: 'ApplicationIcon',
    value: installPath + ',0'
  },
  {
    path: 'HKCU\\Software\\Classes\\ThiskyBrowser\\Application',
    name: 'ApplicationName',
    value: '想天浏览器',
  },
  {
    path: 'HKCU\\Software\\Classes\\ThiskyBrowser\\Application',
    name: 'AppUserModelId',
    value: 'ThiskyBrowser',
  },
  {
    path: 'HKCU\\Software\\Classes\\ThiskyBrowser\\DefaultIcon',
    name: 'ApplicationIcon',
    value: installPath + ',0'
  },
  {
    //这条是控制默认打开行为的参数的，设置出错则无法使用默认打开
    path: 'HKCU\\Software\\Classes\\ThiskyBrowser\\shell\\open\\command',
    name: 'default',
    value: installPath + ' %1',
    type:'REG_DEFAULT'
  },
  {
    path: 'HKCU\\Software\\Classes\\.htm\\OpenWithProgIds',
    name: 'ThiskyBrowser',
    value: 'Empty'
  }, {
    path: 'HKCU\\Software\\Classes\\.html\\OpenWithProgIds',
    name: 'ThiskyBrowser',
    value: 'Empty'
  }, {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities',
    name: 'ApplicationDescription',
    value: 'ThiskyBrowser'
  },
  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities',
    name: 'ApplicationIcon',
    value: installPath + ',0',
    type:'REG_DEFAULT'
  },
  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities',
    name: 'ApplicationName',
    value: 'ThiskyBrowser'
  },
  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\FileAssociations',
    name: '.htm',
    value: 'ThiskyBrowser'
  },
  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\FileAssociations',
    name: '.html',
    value: 'ThiskyBrowser'
  },
  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\FileAssociations',
    name: '.pdf',
    value: 'ThiskyBrowser'
  },
  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\FileAssociations',
    name: '.shtml',
    value: 'ThiskyBrowser'
  },
  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\StartMenu',
    name: 'StartMenuInternet',
    value: 'ThiskyBrowser'
  },
  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\URLAssociations',
    name: 'http',
    value: 'ThiskyBrowser'
  },
  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\URLAssociations',
    name: 'https',
    value: 'ThiskyBrowser'
  },

  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\DefaultIcon',
    name: 'default',
    value: installPath + ',0',
    type:'REG_DEFAULT'
  },

  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\InstallInfo',
    name: 'IconsVisible',
    value: 1,
    type: 'REG_DWORD'
  },
  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\InstallInfo',
    name: 'IconsVisible',
    value: 1,
    type: 'REG_DWORD'
  },
  {
    path: 'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\shell\\open\\command',
    name: 'default',
    value: installPath,
    type:'REG_DEFAULT'
  },
  //设置不要出现弹窗提示
  {
    path: 'HKCU\\Software\\Policies\\Microsoft\\Windows\\Explorer',
    name: 'NoNewAppAlert',
    value: '00000001',
    type: 'REG_DWORD'
  },
  {
    path: 'HKCU\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice',
    name: 'ProgId',
    value: 'ThiskyBrowser',
  },
    //hkcR
  {
    path: 'HKCR\\http\\shell\\open\\ddeexec\\Application',
    value: 'ThiskyBrowser',
    type:'REG_DEFAULT'
  },

]


var keysToCreate = [
  'HKCU\\Software\\Classes\\ThiskyBrowser',
  'HKCU\\Software\\Classes\\ThiskyBrowser\\Application',
  'HKCU\\Software\\Classes\\ThiskyBrowser\\DefaultIcon',
  'HKCU\\Software\\Classes\\ThiskyBrowser\\shell\\open\\command',
  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\FileAssociations',
  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\StartMenu',
  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\URLAssociations',
  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\DefaultIcon',
  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\InstallInfo',
  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\shell\\open\\command'
]

// var registryConfig = {
//   'HKCU\\Software\\RegisteredApplications': {
//     ThiskyBrowser: {
//       value: 'Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities',
//       type: 'REG_SZ'
//     }
//   },
//   'HKCU\\Software\\Classes\\ThiskyBrowser': {
//     default: {
//       value: 'ThiskyBrowser Browser Document',
//       type: ' '
//     }
//   },
//   'HKCU\\Software\\Classes\\ThiskyBrowser\\Application': {
//     ApplicationDescription: {
//       value: '团队工作协作浏览器',
//       type: 'REG_SZ'
//     },
//     ApplicationCompany: {
//       value: '嘉兴想天信息科技有限公司',
//       type: 'REG_SZ'
//     },
//     ApplicationIcon: {
//       value: installPath + ',0',
//       type: 'REG_SZ'
//     },
//     ApplicationName: {
//       value: 'ThiskyBrowser',
//       type: 'REG_SZ'
//     },
//     AppUserModelId: {
//       value: 'ThiskyBrowser',
//       type: 'REG_SZ'
//     }
//   },
//   'HKCU\\Software\\Classes\\ThiskyBrowser\\DefaultIcon': {
//     ApplicationIcon: {
//       value: installPath + ',0',
//       type: 'REG_SZ'
//     }
//   },
//   'HKCU\\Software\\Classes\\ThiskyBrowser\\shell\\open\\command': {
//     default: {
//       value: '"' + installPath + '" "%1"',
//       type: 'REG_DEFAULT'
//     }
//   },
//   'HKCU\\Software\\Classes\\.htm\\OpenWithProgIds': {
//     ThiskyBrowser: {
//       value: 'Empty',
//       type: 'REG_SZ'
//     }
//   },
//   'HKCU\\Software\\Classes\\.html\\OpenWithProgIds': {
//     ThiskyBrowser: {
//       value: 'Empty',
//       type: 'REG_SZ'
//     }
//   },
//   'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities': {
//     ApplicationDescription: {
//       value: 'ThiskyBrowser',
//       type: 'REG_SZ'
//     },
//     ApplicationIcon: {
//       value: installPath + ',0',
//       type: 'REG_DEFAULT'
//     },
//     ApplicationName: {
//       value: 'ThiskyBrowser',
//       type: 'REG_SZ'
//     }
// // }
// //     "ApplicationDescription"="Opera Portable"
// //     "ApplicationIcon"="C:\\Portable\\Opera\\58.0.3135.47\\opera.exe,0"
// //     "ApplicationName"="Opera Portable"
//
//   },
//
//   'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\FileAssociations': {
//     '.htm': {
//       value: 'ThiskyBrowser',
//       type: 'REG_SZ'
//     },
//     '.html': {
//       value: 'ThiskyBrowser',
//       type: 'REG_SZ'
//     }
//   },
//   'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\StartMenu': {
//     StartMenuInternet: {
//       value: 'ThiskyBrowser',
//       type: 'REG_SZ'
//     }
//   },
//   'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\URLAssociations': {
//     http: {
//       value: 'ThiskyBrowser',
//       type: 'REG_SZ'
//     },
//     https: {
//       value: 'ThiskyBrowser',
//       type: 'REG_SZ'
//     }
//   },
//   'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\DefaultIcon': {
//     default: {
//       value: installPath + ',0',
//       type: 'REG_DEFAULT'
//     }
//   },
//   'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\InstallInfo': {
//     IconsVisible: {
//       value: 1,
//       type: 'REG_DWORD'
//     }
//   },
//   'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\shell\\open\\command': {
//     default: {
//       value: installPath,
//       type: 'REG_DEFAULT'
//     }
//   }
// }


var registryInstaller = {
  install:async function () {
    // return new Promise(function (resolve, reject) {
    //  await regeditTool.addKeyList(registryConfig)
    // })
    await regeditTool.addKeyList(registryConfig)
    await regeditTool.setDefaultBrowser()

  },
  uninstall: function () {
    console.log(installPath)
    return new Promise(function (resolve, reject) {
      regeditTool.deleteKeyList(registryConfig)
    })
  }
}
//
//
// var registryInstaller = {
//   install: function () {
//     console.log(installPath)
//     return new Promise(function (resolve, reject) {
//       regedit.createKey(keysToCreate, function (err) {
//         regedit.putValue(registryConfig, function (err) {
//           if (err) {
//             reject(err)
//           } else {
//             resolve()
//           }
//         })
//       })
//     })
//   },
//   uninstall: function () {
//     console.log(installPath)
//     return new Promise(function (resolve, reject) {
//       regedit.deleteKey(keysToCreate, function (err) {
//         if (err) {
//           reject(err)
//         } else {
//           resolve()
//         }
//       })
//     })
//   }
// }
