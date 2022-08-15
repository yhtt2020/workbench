import { ExtensionContext } from '../context'
import {ExtensionEvent} from "../router";

/**
 * Stub implementation for chrome.commands API.
 */
export class PermissionsAPI {
  constructor(private ctx: ExtensionContext) {
    const handle = this.ctx.router.apiHandler()
    handle('permissions.contains', this.contains.bind(this))
  }

  private async contains(event: ExtensionEvent,permissions:Array<String>) {
    //todo 补充permissions管理实现
    return true
  }
}
