class Tools {
  /**
   * 复制到剪切板功能
   * @param {String} e 需复制内容
   */
  static copy(e) {
    let transfer = document.createElement('input')
    document.body.appendChild(transfer)
    transfer.value = e
    transfer.focus()
    transfer.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
    }
    transfer.blur()
    document.body.removeChild(transfer)
    ipc.send('message',{type:'success',config:{content:'复制成功'}})
  }
}

function initialize () {
  if(typeof(window) == 'undefined') {
    return Tools
  } else {
    window.tools = new Tools()  //todo
    window.Tools = Tools
  }
}

module.exports = { initialize }
