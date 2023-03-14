
class ActionExecutor {
  action: IDeckAction
  args: IArgs

  constructor(action) {
    this.action = action
    this.args = action.args
  }

  doAction():ActionResult {

  }
}

export default ActionExecutor
