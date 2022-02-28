/* detects if a page is readerable, and tells the main process if it is */
/**判断页面是否可使用阅读模式
 * @returns {boolean}
 */
function pageIsReaderable () {
  var paragraphMap = new Map()

  var paragraphs = document.querySelectorAll('p')
  var totalLength = 0

  if (!paragraphs) {
    return false
  }

  for (var i = 0; i < paragraphs.length; i++) {
    var pLength = paragraphs[i].textContent.length//原规则： Math.max(paragraphs[i].textContent.replace(/\s+/g, ' ').length - 100, -30)
    totalLength += pLength

    var prev = paragraphMap.get(paragraphs[i].parentNode) || 0
    paragraphMap.set(paragraphs[i].parentNode, prev + pLength)
  }

  var largestValue = 0

  paragraphMap.forEach(function (value, key) {
    if (value > largestValue) {
      largestValue = value
    }
  })
  //如果最长的行占总行的长度比例为0.1以上，则可认为是可阅读的，放宽了原要求
  //if ((largestValue > 600 && largestValue / totalLength > 0.33) || (largestValue > 400 && document.querySelector('article, meta[property="og:type"][content="article"]'))) {
  if ((largestValue > 50 && largestValue / totalLength > 0.1) || (largestValue > 200 && document.querySelector('article, meta[property="og:type"][content="article"]'))) {
    return true
  } else {
    return false
  }

}

function checkReaderStatus () {
  if (pageIsReaderable()) {
    ipc.send('canReader')
  }
}

if (process.isMainFrame) {
  // unlike DOMContentLoaded, readystatechange doesn't wait for <script defer>, so it happens a bit sooner
  document.addEventListener('DOMContentLoaded', function () {
    if (document.readyState === 'interactive') {
      checkReaderStatus()
    }
  })
  window.addEventListener('load', checkReaderStatus)
}
