import econstructor from "./electron/econstructor"
import bconstructor from "./browser/bconstructor"

export default class xtbk {
  static content(config= {}) {
    return xtbk.get_instance(config)
  }

  //不同环境获取不同的实例
  static get_instance(config) {
    if(window.process) {
      return new econstructor(config, this)
    } else {
      return new bconstructor(config, this)
    }
  }

}





