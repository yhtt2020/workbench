let $ = require('cash-dom')
const {insertCss} =require('./common.js')
$(()=>{
  $('.download_entry').remove()
  $('.nav_view.ng-scope').css({
    top:'153px',
    height:'calc(100vh - 255px)'
  })
  insertCss(`
  html{
      height: calc(100vh);
    overflow-y: hidden;
    }
  body{
  background:#2e3238 !important;
  zoom:1.2
  }
  #chatArea{
  height:calc(100vh - 95px) !important;
  }
  .chat .box_ft .content .flex{
    height:2em !important
  }
  .chat .box_ft{
   height:112px !important
  }
  .chat .box_bd{
  bottom:122px !important
  }
  `)
  // document.body.style.zoom='1.2'
  // $('.chat_item').click(()=>{
  //   setTimeout(()=>{
  //     $('#chat-area').css({
  //       height:'calc(100vh - 95px)'
  //     })
  //     $('.chat .box_ft .content .flex').css({
  //       height:'2em'
  //     })
  //     $('.chat .box_ft').css({
  //       height:'112px'
  //     })
  //     $('.chat .box_bd').css({
  //       bottom:'122px'
  //     })
  //   },200)
  //
  // })

  // $('[ui-view=contentView]').css({
  //   height:'100vh'
  // })
})
