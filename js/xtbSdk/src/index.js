import econstructor from "./electron/econstructor"
import bconstructor from "./browser/bconstructor"

export default class xtbk {
  static content(config= {}) {
    return xtbk.get_instance(config)
  }

  //不同环境获取不同的实例
  static get_instance(config) {
    const electronVersion = window.process.versions['electron']
    if(electronVersion) {
      return new econstructor(config, this)
    } else {
      return new bconstructor(config, this)
    }
  }

}






