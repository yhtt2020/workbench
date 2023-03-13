import BrowserAction from "./browserAction";
import ActionExecutor from "./actionExecutor";
/**
 * 动作处理类，根据指令类型，分发处理指令，此类不做具体操作，只负责分发和返回结果
 */
class ActionHandler {
  action: IDeckAction
  args: IArgs


  result: ActionResult

  constructor(action) {
    this.action = action
    this.args = action.args
  }

  /**
   * 处理一个指令
   */
  doAction(): ActionResult {
    let {action, args} = this

    let actionCommander: ActionExecutor
    switch (action.group.name) {
      case 'browser':
        actionCommander = new BrowserAction(action)
    }
    return actionCommander.doAction()
  }
}

/**
 * 动作执行结果，status 1成功 0失败 -1未知 ，message 相关信息，如有
 */


export {ActionHandler}
