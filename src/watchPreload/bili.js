let $ = require('cash-dom')
const { TaskHandler, utils } = require('./base')
const clean = utils.clean
if(!window.location.href.endsWith('iframe.html')){
  //因为B站还会加载一个frame，这个是不需要注入代码的
  function getData () {
    //标题
    let title = $('#viewbox_report h1 ').text()

    //真实阅读数
    let view = $('.video-data-list .view.item').attr('title').replace('总播放数', '')
    //阅读数文本
    let viewText = clean($('.video-data-list .view.item').text())
    //弹幕
    let dm = clean($('.video-data-list .dm.item').text())

    //发布日期
    let pudate = clean($('.video-data-list .pudate').text())

    //点赞
    let like = $('.video-toolbar-v1 .like .info-text').text()
    //投币
    let coin = $('.video-toolbar-v1 .coin .info-text').text()
    //收藏
    let collect = $('.video-toolbar-v1 .collect .info-text').text()

    let share=$('.share-wrap .info-text').text()


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
      collect,
      totalReply,
      cover,
      cover_320_200,
      author
    }

    return data
  }

  window.taskHandler = new TaskHandler({
    test: () => {
      try {
        let data = getData()
        if (!data.title) {
          return undefined
        }
        return data
      } catch (e) {
        console.log('抓取测试失败', e)
        return undefined
      }

    },
    timeouts:[
      {
        fn:()=>{
          //自动清理掉无用的视频部分，以提升性能
          $('video').remove()

          let data=getData()
          return data
        },
        timeout:5000
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
          let online = $('.bpx-player-video-info-online b').text()
          return { online: online }
        },
        interval: 10 * 1000
      }
    ]

  })
  taskHandler.init()
}




