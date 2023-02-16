function insertCss (cssText) {
  let head = document.head || document.getElementsByTagName('head')[0]
  let style = document.createElement('style')
  style.type = 'text/css'
  let textNode = document.createTextNode(cssText)
  style.appendChild(textNode)
  head.appendChild(style)
}
module.exports={insertCss}
