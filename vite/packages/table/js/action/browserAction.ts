import ActionExecutor from './actionExecutor'
import browser from "../common/browser";
/**
 * 处理浏览器动作的类
 */
class BrowserAction extends ActionExecutor {
  doAction() :ActionResult{
    let {action, args} = this
    let result = -1
    switch (action.name) {
      case 'addTab':
        if (args.position === 'builtin') {
          //内置浏览器
          if (args.tab === 'current') {
            browser.openInInner(args.url)
            result = 1
          } else if (args.tab === 'new') {
            //创建新标签组并打开
            ipc.send('addTask', {name: args.title, url: args.url})
            result = 1
            //todo 创建标签组打开
          }
        } else if (args.position === 'system') {
          require('electron').shell.openExternal(args.url)
          result = 1
        } else {
          result = -1
          //todo table内置暂未实现
        }
        break
      case 'addTask':
        ipc.send('addTask', {name: args.title})
        result = 1
        break
    }
    return {
      message: '',
      status: result
    }
  }
}

export default BrowserAction
