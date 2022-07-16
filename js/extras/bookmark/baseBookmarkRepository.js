const ipc = require('electron').ipcRenderer
const fileHelpers = require('../fileHelpers.js')

class baseBookmarkRepository {
  static importHtml(data) {
    let tree = new DOMParser().parseFromString(data, 'text/html')
    console.log(tree, '$$$$$$$$$$')
    //把tree dom处理成递归文件需要的格式
    let bookmarksArray = Array.from(tree.getElementsByTagName('dt'))
    bookmarksArray.reduce((combined, currentVal) => {
      if(currentVal.childNodes.length === 2 && currentVal.firstChild.nodeName === "A" && currentVal.parentNode.previousElementSibling.innerText === 'Bookmarks') {
        //这种情况说明是其他书签中的书签，并不是书签栏中的书签
        combined.children.push({
          type: 'url',
          name: currentVal.innerText,
          url: currentVal.firstChild.href
        })
      } else{
        //这种情况是标准书签夹的中的书签
        //用递归去处理N层的dom树，需要写个function
      }
      return combined
    }, {children: []})

    return bookmarksArray
  }
}

module.exports = baseBookmarkRepository
