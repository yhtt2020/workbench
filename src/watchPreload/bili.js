let $ = require('cash-dom')
const { TaskHandler, utils } = require('./base')
const clean = utils.clean
function convertToNum(text){
  if(text.includes('万'))
  {
    return +(text.replace('万',''))*10000
  }else{
    return +text
  }
}
if (!window.location.href.endsWith('iframe.html')) {
  //因为B站还会加载一个frame，这个是不需要注入代码的
  function getData () {
    //标题
    let title = $('#viewbox_report h1 ').text()

    //真实阅读数
    //let view = $('.video-info-detail .view.item').attr('title').replace('总播放数', '')
    //阅读数文本
    let viewText = clean($('.video-info-detail-list .view.item').text())
    let view= convertToNum(viewText)
    //弹幕
    let dm = clean($('.video-info-detail .dm.item').text())

    //发布日期
    let pudate = clean($('.video-info-detail .pubdate-text').text())

    //点赞
    let like = $('.video-toolbar-container .video-like-info').text()
    //投币
    let coin = $('.video-toolbar-container .video-coin-info').text()
    //收藏
    let collect = $('.video-toolbar-container .video-fav-info').text()

    let share = $('.video-toolbar-container .video-share-info').text()

    //封面
    let cover = $('head meta[itemprop=image]').attr('content').replace('@100w_100h_1c.png', '')
    //封面320*200
    let cover_320_200 = cover + '@320w_200h'

    //作者名称
    let authorName = clean($('.up-info_right .username').text())
    //作者粉丝数
    let authorFollow = clean($('.up-info_right .follow-btn').text()).replaceAll('关注', '')

    //评论数
    let totalReply = $('.total-reply').text()

    let duration = $('.bpx-player-ctrl-time-duration').text()

    //拼装作者
    let author = {
      name: authorName,
      follow: authorFollow
    }

    let data = {
      title: title,
      view,
      viewText,
      dm,
      pudate,
      like,
      coin,
      share,
      duration,
      collect,
      totalReply,
      cover,
      cover_320_200,
      author
    }

    return data
  }

  let doGrab = null
  let getOnline = null
  window.taskHandler = new TaskHandler({
    test: () => {
      try {
        let data = getData()
        if (!data.title) {
          return undefined
        }
        console.log(data)
        return data
      } catch (e) {
        return undefined
      }

    },
    timeouts: [
      {
        fn: () => {
          //自动清理掉无用的视频部分，以提升性能
          //$('video').remove()
          if(doGrab){
            doGrab()
          }
        },
        timeout: 5000
      },
      {
        fn: () => {
          let timer = setInterval(() => {
            try {
              $('video').remove()
              // $('html').on('keydown',"body",()=>{
              // })
              // let e=new Event('keydown')
              // e.keyCode=40
              // $('html body').trigger(e)
              // console.log('模拟视频点击成功')
              clearInterval(timer)
            } catch (e) {
              console.log(e)
            }
          }, 1000)
          //$('.bpx-player-row-dm-wrap').remove()

        },
        timeout: 2000
      }
    ],
    start: () => {
      try {
        return null //不抓取开始时机
      } catch (e) {
        console.warn('未能抓到数据')
      }

    },
    intervals: [
      {
        fn: () => {
          if(getOnline){
            getOnline()
          }
        },
        interval: 10 * 1000
      }
    ]

  })

  doGrab = () => {
    let data = getData()
    window.taskHandler.saveData(data, 'timeout', '').then(r => {})
  }
  getOnline = () => {
    let online = $('.bpx-player-video-info-online b').text()
    window.taskHandler.saveData({ online: online }, 'interval').then(r => {})
  }
  taskHandler.init()
}




