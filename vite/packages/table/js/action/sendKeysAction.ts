import ActionExecutor from './actionExecutor'
import {runNir} from "../common/exec";

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
        message.push(await runNir('sendkeypress '+args.keys))
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
