import ActionExecutor from './actionExecutor'
import {runNir} from "../common/exec";
import * as shortcutTools from "../../apps/shortcutKey/shortcutTools";

/**
 * 处理浏览器动作的类
 */
class SendKeysAction extends ActionExecutor {
  async doAction(): ActionResult {
    let {action, args} = this
    let result = -1
    let message = []
    switch (action.name) {
      case 'sendKeys':

        console.log('执行命令')
        console.log(this.action, this.args, 'ddd')
        shortcutTools.doKey(this.args.keys)
        result = 1
        break
    }
    return {
      message: '',
      status: result
    }
  }
}

export default SendKeysAction
