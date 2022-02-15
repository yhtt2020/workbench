/**
 * 系统版本号判断
 * @type {{winVersionCase(*=): (boolean), isWin11(): boolean, isWin10(): boolean, systemVersion(): string, platform(): NodeJS.Platform, isWin7(): boolean}}
 */
const systemType = {
  /**
   * 系统版本号
   * win10是10.0.1xxx，win11是10.0.2xxx win8 6.2 win7是6.1 vista 6.0  XP5.2 2000 5.0 https://blog.csdn.net/dingshaomiao/article/details/117339612
   *
   * mac下是 https://support.apple.com/zh-cn/HT201260
   * 常用：Monterey 12.1
   * Bigsur 11.6.2
   * Catalina 10.15.7
   * Mojave 10.14.6
   * High Sierra 10.13.6
   * @returns {string}
   */
  systemVersion () {
    return process.getSystemVersion()
  },
  /**
   * win32 是windows darwin是mac
   *  "aix" | "android" | "darwin" | "freebsd" | "haiku" | "linux" | "openbsd" | "sunos" | "win32" |
   * @returns {NodeJS.Platform}
   */
  platform () {
    return process.platform
  },
  /**
   * 系统平台中文名称
   */
  platformAlias () {
    switch (systemType.platform()) {
      case 'darwin':
        return 'MacOS'
      case 'win32':
        return 'Windows'
    }
  },
  /**
   * 获得版本号的中文名称
   * @returns {string}
   */
  versionAlias () {
    const sysVersion = process.getSystemVersion()
    if (systemType.platform() === 'win32') {
      if (sysVersion.startsWith('10.0.1')) {
        return 'win10'
      } else if (sysVersion.startsWith('10.0.2')) {
        return 'win11'
      } else if (sysVersion.startsWith('6.1'))
        return 'win7'
      else return '早于win7'
    } else if (systemType.platform() === 'darwin') {
      if (sysVersion.startsWith('12.1')) {
        return 'Monterey'
      } else if (sysVersion.startsWith('11.6.2')) {
        return 'Big Sur'
      } else if (sysVersion.startsWith('10.15.7')) {
        return 'Catalina'
      } else if (sysVersion.startsWith('10.14.6')) {
        return 'Mojave'
      } else if (sysVersion.startsWith('10.13.6')) {
        return 'High Sierra'
      } else if (sysVersion.startsWith('10.12.6')) {
        return 'Sierra'
      } else if (sysVersion.startsWith('10.11.6')) {
        return 'El Capitan'
      } else if (sysVersion.startsWith('10.10.5')) {
        return 'Yosemite'
      }else{
        return '早于Yosemite'
      }
    }
  },
  winVersionCase (versionStart) {
    const sysVersion = process.getSystemVersion()
    if (sysVersion.startsWith(versionStart) && systemType.platform() === 'win32') {
      return true
    } else {
      return false
    }
  },
  isWin7 () {
    return systemType.winVersionCase('6.1')
  },
  isWin10 () {
    return systemType.winVersionCase('10.0.1')
  },
  isWin11 () {
    return systemType.winVersionCase('10.0.2')
  }
}
module.exports = systemType
