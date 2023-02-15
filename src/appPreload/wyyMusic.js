let $ = require('cash-dom')
let fs = require('fs')
function frame () {
  insertCss(fs.readFileSync(__dirname + '/css/wyyFrame.css'))
  $('.m-nav li ').eq(3).remove()
  $('.icn.icn-share').remove()

  require('electron').ipcRenderer.on('wyyAction',(event,args)=>{
    switch (args.action){
      case 'play':
        //播放
        $('.g-btmbar .btns .ply')[0].click()
        break
      case 'next':
        $('.g-btmbar .btns .nxt')[0].click()
        break
      case 'prev':
        $('.g-btmbar .btns .prv')[0].click()
        break
      case 'pause':
        $('.g-btmbar .btns .ply')[0].click()
        break
      case 'prompt':
        if(!$('.listlyric')[0]){
          $('[data-action=panel]')[0].click()
        }
    }
  })
  setInterval(() => {
    //console.log('回报数据')
    let cover = $('.head.j-flag img').eq(0).attr('src')
    let title = $('.m-playbar .words .name').eq(0).text()
    let singer = $('.m-playbar .words .by a').eq(0).text()
    let progress = $('.m-pbar .time em').eq(0).text()

    let total = $('.m-pbar .time').eq(0).text().split('/')[1]
    let word = $('.m-playbar .listlyric p.z-sel').eq(0).text()
    let playing=$('[data-action=pause]').length>0
    let prompt=$('.listlyric').html()
    let scrollTop=0
    if($('.listlyric')[0]){
      scrollTop=$('.listlyric')[0].scrollTop
    }

    require('electron').ipcRenderer.send('updateMusicStatus', {
      playing,
      cover,
      title,
      singer,
      progress,
      total,
      word,
      prompt,
      scrollTop
    })
  }, 1000)

}

function insertCss (cssText) {
  let head = document.head || document.getElementsByTagName('head')[0]
  let style = document.createElement('style')
  style.type = 'text/css'
  let textNode = document.createTextNode(cssText)
  style.appendChild(textNode)
  head.appendChild(style)
}

function website () {

  // $('#g_nav2').style.paddingLeft='80px'
  $('.g-ft ').remove()
  $('.n-ban .download').remove()
  $('.m-nav li ').eq(3).remove()
  $('#index-banner').remove()
  setTimeout(()=>{
    insertCss(fs.readFileSync(__dirname + '/css/wyyContent.css'))
  },1000)
}

$(() => {
  if ($('.m-playbar').length > 0) {
    console.log('播放器')
    frame()
  } else {
    console.log('网页')
    website()
    if (location.href === 'https://music.163.com/discover') {
      insertCss(`body{
  background: #242424;
}
`)

    }
  }
})


