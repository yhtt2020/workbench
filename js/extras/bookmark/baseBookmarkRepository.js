const ipc = require('electron').ipcRenderer
const fileHelpers = require('../fileHelpers.js')

class baseBookmarkRepository {
  static importHtml(data) {
    let tree = new DOMParser().parseFromString(data, 'text/html')
    console.log(tree, '$$$$$$$$$$')


    let calcedItem = {}
    //递归计算dt的level和parent
    function recurCalc(dt, levelParam = 1, parentParam = null, typeParam = null, nameParam = null, urlParam = null) {
      let level = levelParam
      let parent = parentParam
      let type = typeParam
      let name = nameParam
      let url = urlParam
      if(dt.firstChild.nodeName === 'H3' && dt.firstChild.attributes[2] && dt.firstChild.attributes[2].name === 'personal_toolbar_folder') {
        //说明是书签栏 根root dt
        return
      }

      if(dt.childNodes.length === 2 && dt.firstChild.nodeName === "A" && dt.parentNode.previousElementSibling.innerText === 'Bookmarks') {
        //这种情况说明是其他书签中的书签，并不是书签栏中的书签
        calcedItem = {
          type: 'url',
          name: dt.innerText,
          url: dt.firstChild.href,
          level,
          parent
        }
        return
      } else {
        //这种情况是标准书签夹的中的书签，可能是folder，可能是书签a-link，需要用到递归分析它们的层级和parent
        if(dt.parentNode.previousElementSibling.nodeName === 'H3' && dt.parentNode.previousElementSibling.attributes[2] && dt.parentNode.previousElementSibling.attributes[2].name === 'personal_toolbar_folder') {
          //直到父元素的prev元素是h3，且存在personal_toolbar_folder属性，且innerText是书签栏的时候，跳出此次递归
          type = type ? type : 'folder'
          name = name ? name : dt.firstChild.innerText
          calcedItem = {
            type,
            name,
            url,
            level,
            parent
          }
          return
        }

        if(dt.firstChild.nodeName === 'A' && dt.parentNode.previousElementSibling.nodeName === 'H3' && !dt.parentNode.previousElementSibling.attributes[2]) {
          //dt中是a标签的情况   a-link的情况
          parent = parent ? parent : dt.parentNode.previousElementSibling.innerText
          type = type ? type : 'url'
          name = name ? name : dt.firstChild.innerText
          url = url ? url : dt.firstChild.href
          recurCalc(dt.parentNode.parentNode, level+1, parent, type, name, url)
        }

        if(dt.firstChild.nodeName === 'H3' && dt.parentNode.previousElementSibling.nodeName === 'H3' && !dt.parentNode.previousElementSibling.attributes[2]) {
          //dt中是h3的情况 folder的情况
          parent = parent ? parent : dt.parentNode.previousElementSibling.innerText
          type = type ? type : 'folder'
          name = name ? name : dt.firstChild.innerText
          url = url ? url : null
          recurCalc(dt.parentNode.parentNode, level+1, parent, type, name, url)
        }
      }
    }

    //把tree dom处理成一个能表示结构的简单数组
    let bookmarksArray = Array.from(tree.getElementsByTagName('dt'))
    let newarray = bookmarksArray.reduce((combined, currentVal) => {
      recurCalc(currentVal)
      combined.push(calcedItem)
      calcedItem = {}
      return combined
    }, [])

    console.log(newarray, '!!!!!!!!!')


    function listLoop(arr, parentName) {
      let newarray = []
      arr.forEach(v => {
        if(v.level > 0 && v.parent === parentName) {
          v.children = listLoop(arr, v.name)
          newarray.push(v)
        }
      })

      return newarray
    }

    let a = listLoop(newarray, null)


    console.log(a, '$$$$$$$$$$$$')
  }
}

module.exports = baseBookmarkRepository
