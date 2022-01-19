var regedit = require('regedit')
const setResult=regedit.setExternalVBSLocation(__dirname+'/vbs')
console.log(setResult)


var installPath = process.execPath

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

var registryConfig = {
  'HKCU\\Software\\RegisteredApplications': {
    ThiskyBrowser: {
      value: 'Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Classes\\ThiskyBrowser': {
    default: {
      value: 'ThiskyBrowser Browser Document',
      type: 'REG_DEFAULT'
    }
  },
  'HKCU\\Software\\Classes\\ThiskyBrowser\\Application': {
    ApplicationDescription: {
      value: '团队工作协作浏览器',
      type: 'REG_SZ'
    },
    ApplicationCompany: {
      value: '嘉兴想天信息科技有限公司',
      type: 'REG_SZ'
    },
    ApplicationIcon: {
      value: installPath + ',0',
      type: 'REG_SZ'
    },
    ApplicationName: {
      value: 'ThiskyBrowser',
      type: 'REG_SZ'
    },
    AppUserModelId: {
      value: 'ThiskyBrowser',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Classes\\ThiskyBrowser\\DefaultIcon': {
    ApplicationIcon: {
      value: installPath + ',0',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Classes\\ThiskyBrowser\\shell\\open\\command': {
    default: {
      value: '"' + installPath + '" "%1"',
      type: 'REG_DEFAULT'
    }
  },
  'HKCU\\Software\\Classes\\.htm\\OpenWithProgIds': {
    ThiskyBrowser: {
      value: 'Empty',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Classes\\.html\\OpenWithProgIds': {
    ThiskyBrowser: {
      value: 'Empty',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities': {
    ApplicationDescription: {
      value: 'ThiskyBrowser',
      type: 'REG_SZ'
    },
    ApplicationIcon: {
      value: installPath + ',0',
      type: 'REG_DEFAULT'
    },
    ApplicationName: {
      value: 'ThiskyBrowser',
      type: 'REG_SZ'
    }
// }
//     "ApplicationDescription"="Opera Portable"
//     "ApplicationIcon"="C:\\Portable\\Opera\\58.0.3135.47\\opera.exe,0"
//     "ApplicationName"="Opera Portable"

  },

  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\FileAssociations': {
    '.htm': {
      value: 'ThiskyBrowser',
      type: 'REG_SZ'
    },
    '.html': {
      value: 'ThiskyBrowser',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\StartMenu': {
    StartMenuInternet: {
      value: 'ThiskyBrowser',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\Capabilities\\URLAssociations': {
    http: {
      value: 'ThiskyBrowser',
      type: 'REG_SZ'
    },
    https: {
      value: 'ThiskyBrowser',
      type: 'REG_SZ'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\DefaultIcon': {
    default: {
      value: installPath + ',0',
      type: 'REG_DEFAULT'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\InstallInfo': {
    IconsVisible: {
      value: 1,
      type: 'REG_DWORD'
    }
  },
  'HKCU\\Software\\Clients\\StartMenuInternet\\ThiskyBrowser\\shell\\open\\command': {
    default: {
      value: installPath,
      type: 'REG_DEFAULT'
    }
  }
}

var registryInstaller = {
  install: function () {
    console.log(installPath)
    return new Promise(function (resolve, reject) {
      regedit.createKey(keysToCreate, function (err) {
        regedit.putValue(registryConfig, function (err) {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
    })
  },
  uninstall: function () {
    console.log(installPath)
    return new Promise(function (resolve, reject) {
      regedit.deleteKey(keysToCreate, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}
