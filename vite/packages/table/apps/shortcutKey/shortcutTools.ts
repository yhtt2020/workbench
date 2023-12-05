import {message, Modal, notification} from "ant-design-vue";
import {RocketFilled} from "@ant-design/icons-vue";
import {h} from 'vue'
import {appStore} from "../../store";

const win32 = $models.win32

function doKey(item) {
  if (!appStore().aided) {
    Modal.confirm({
      content: '必须开启辅助模式才可以触发快捷键，是否为您打开辅助模式？',
      onOk: () => {
        appStore().enterAided()
        notification.info({
          message: '已为您打开辅助模式，请再次点击快捷键。'
        })
      },
      okText: '打开辅助模式',
      centered: true,
    })
    return
  }
  let keys = [...item.keys]
  let mainKey = ''
  const map={
    'pgup':'PageUp',
    'pgdn':'PageDown',
    'left':'ArrowLeft',
    'right':'ArrowRight',
    'up':'ArrowUp',
    'down':'ArrowDown',
    'end':'End',
    'home':'Home',
    'delete':'Delete'
  }
  keys = keys.map(key => {
    const lowerCase = key.toLowerCase()
    if (!['ctrl', 'shift', 'alt', 'win'].includes(lowerCase)) {
      mainKey = lowerCase
    }
    if (mainKey.startsWith('f')) {
      //F1-n
      mainKey = mainKey.replace('f', 'F')
    } else {
      //特殊键
      for(const key of Object.keys(map)){
        if(key===mainKey){
          mainKey=map[key]
        }
      }
    }


    return lowerCase
  })
  const ctrl = keys.includes('ctrl')
  const shift = keys.includes('shift')
  const alt = keys.includes('alt')
  const win = keys.includes('win')
  console.log('执行键位', mainKey)
  try {
    if (item.keys.length === 1) {
      if (mainKey) {
        //单一键
        win32.sendKeyboard(mainKey)
        return
      } else {
        notification.info({
          message:'无效键位，请阅读说明。',
          key:'pressTip'
        })
        return false
      }
    } else {
      win32.sendBasicKeys(
        ctrl,
        shift, alt, win, mainKey)
    }
  } catch (e) {
    notification.error({
      message: '执行键位失败，失败原因是：' + e,
      duration: 10,
      key:'pressTip'
    })
  }
  notification.info({
    message: item.title + ' ：' + item.keys.join(' + '),
    icon: h(RocketFilled)
  })
  return true
}

export {doKey}
