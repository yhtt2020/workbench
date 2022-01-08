//import econstructor from "./electron/econstructor"
import bconstructor from "./browser/bconstructor"

export default class tsbk {
  static content(config= {}) {
    return tsbk.get_instance(config)
  }

  //web应用获取实力
  static get_instance(config) {
    return new bconstructor(config, this)
  }

}






