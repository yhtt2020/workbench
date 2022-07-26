import {ExtensionContext} from '../context'
import {ExtensionEvent} from "../router";
import {getExtensionManifest, resolveExtensionPath} from "./common";
import {app} from 'electron';

const fs = eval('require')('fs')
const path = eval('require')('path')

/**
 * Stub implementation for chrome.i18n API.
 */
export class I18nAPI {
  constructor(private ctx: ExtensionContext) {
    const handle = this.ctx.router.apiHandler()
    handle('i18n.getAllMessage', this.getAllMessage.bind(this))
  }

  private getAllMessage(event: ExtensionEvent) {
    let manifest = getExtensionManifest(event.extension)
    let localeName = app.getLocale().replace('-', '_')
    let localePath = resolveExtensionPath(event.extension, '_locales')
    if (!fs.existsSync(localePath)) {
      return {}
    }
    let message: String = ''
    if (fs.existsSync(path.join(localePath, localeName))) {
      //如果存在语言包
      message = path.join(localePath, localeName)
      //存在中文语言包
    } else {
      //如果不存在语言包，直接返回
      message = path.join(localePath, manifest['default_locale'])
    }
    let file = path.join(message, 'messages.json')
    let localeJson: Object = JSON.parse(fs.readFileSync(file, 'utf8'))
    return localeJson
  }
}



