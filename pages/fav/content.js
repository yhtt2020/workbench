// ==UserScript==
// @name         收藏夹插件
// @namespace    http://www.apps.vip
// @version      0.0.1
// @description  随时随地收藏网页内容
// @author       想天软件
// @match        *://*/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// ==/UserScript==
window.jQuery.noConflict(true)


window.jQuery(function () {
  let inserted = false
  let dragImage=window.jQuery('<div id=\'drag-images\' style=\'position: fixed; top: -100000px;\'></div>')
  'use strict'
  let tpl = window.jQuery(`
<!--<div  id="_fav-modal" style="z-index: 99999999 !important; position: fixed !important; top: 0; left: 0; right: 0; bottom: 0;background: rgba(0,0,0,0.32)">-->
<!--  -->
<!--</div>-->
<div  id="_fav-modal" style="border-radius: 8px;overflow: hidden;display: flex;width: 350px;position: fixed;z-index:999999 !important;left: 400px;top:400px;height: 190px;box-shadow: 0 0 16px rgba(58,58,58,0.22)">
    <div id="_fav_drag_box" style="flex: auto;background: #f1f2f4;text-align: center;padding: 10px;">
      <div style="border: 1px dashed #c1c1c1;margin:10px;border-radius: 6px;padding: 10px;height: 130px">
        <div style="border-radius: 50%;padding: 6px;background: rgb(234,234,234);width: 30px;height: 30px;display: inline-block;margin-bottom: 10px">
          <svg t="1646708680481" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11711" width="32" height="32"><path d="M896 597.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v170.666667a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128v-170.666667a42.666667 42.666667 0 0 1 85.333334 0v170.666667a42.538667 42.538667 0 0 0 36.864 42.24L213.333333 853.333333h597.333334a42.538667 42.538667 0 0 0 42.24-36.864L853.333333 810.666667v-170.666667a42.666667 42.666667 0 0 1 42.666667-42.666667zM512 85.333333a42.666667 42.666667 0 0 1 42.666667 42.666667l-0.042667 408.96 138.410667-138.325333a42.666667 42.666667 0 1 1 60.330666 60.330666l-211.2 211.2a42.453333 42.453333 0 0 1-22.613333 11.818667l-5.034667 0.597333h-5.034666a42.496 42.496 0 0 1-27.648-12.373333l-211.2-211.2a42.666667 42.666667 0 1 1 60.330666-60.373333L469.333333 536.917333 469.333333 128a42.666667 42.666667 0 0 1 42.666667-42.666667z" fill="#666666" p-id="11712"></path></svg>
        </div>
        <div style="line-height: 30px;color: #333;margin-bottom: 10px;font-size: 15px"><svg style="vertical-align: middle;margin-right: 4px" t="1646708862627" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23610" width="32" height="32"><path d="M515.3792 514.2016m-450.816 0a450.816 450.816 0 1 0 901.632 0 450.816 450.816 0 1 0-901.632 0Z" fill="#FFBC42" p-id="23611"></path><path d="M536.5248 507.6992l-17.664-35.7376-17.664 35.7376a52.736 52.736 0 0 1-39.68 28.8256l-39.4752 5.7344 28.5696 27.8528c12.4416 12.0832 18.0736 29.5424 15.1552 46.6432l-6.7584 39.3216 35.2768-18.5344c15.36-8.0896 33.6896-8.0896 49.0496 0l35.2768 18.5344-6.7584-39.3216c-2.9184-17.1008 2.7136-34.5088 15.1552-46.6432l28.5696-27.8528-39.4752-5.7344a52.736 52.736 0 0 1-39.5776-28.8256z" fill="#FFFFFF" p-id="23612"></path><path d="M747.1616 336.7424h-225.1264c-12.1344 0-23.5008-5.9392-30.464-15.9232l-40.3968-53.2992a37.0688 37.0688 0 0 0-30.464-15.9232h-130.048c-41.1136 0-74.3936 33.3312-74.3936 74.3936v376.4736c0 41.1136 33.3312 74.3936 74.3936 74.3936h456.4992c41.1136 0 74.3936-33.3312 74.3936-74.3936V416.0512c0-41.1136-33.3312-79.3088-74.3936-79.3088z m-81.6128 239.0016l-35.1232 34.2016 8.2944 48.3328c3.4304 19.9168-4.608 39.6288-20.9408 51.5072-16.3328 11.8784-37.5808 13.4144-55.5008 3.9936l-43.4176-22.8352-43.4176 22.8352c-7.7824 4.096-16.1792 6.0928-24.576 6.0928-10.8544 0-21.6576-3.4304-30.9248-10.1376-16.3328-11.8784-24.3712-31.5904-20.9408-51.5072l8.2944-48.3328-35.1232-34.2016a52.38272 52.38272 0 0 1-13.312-54.016c6.2464-19.2 22.528-32.9728 42.5472-35.84l48.5376-7.0656 21.7088-43.9808c8.96-18.1248 27.0336-29.3888 47.2576-29.3888 20.1728 0 38.2976 11.264 47.2576 29.3888l21.7088 43.9808 48.5376 7.0656c19.968 2.9184 36.3008 16.64 42.5472 35.84 6.144 19.2512 1.024 39.936-13.4144 54.0672z" fill="#FFFFFF" p-id="23613"></path></svg>收藏到收集箱</div>
        <div style="color: #999;font-size: 12px">拖放到这里，快速收藏到收集箱</div>
      </div>
    </div>
    <div hidden style="width:150px;background: white;position: relative;font-size: 12px;padding: 10px">
      <div>
        <div>
          <div class="folder" style="padding: 5px;border-radius: 4px;">文件夹1</div>
          <div class="folder" style="padding: 5px;border-radius: 4px;">文件夹2</div>
          <div class="folder" style="padding: 5px;border-radius: 4px;">文件夹3</div>
          <div class="folder" style="padding: 5px;border-radius: 4px;">文件夹5</div>
        </div>
      </div>
      <div class="folder" style="z-inde:999999;position:absolute;bottom:10px;padding: 5px;padding-top:10px;border-top: 1px solid #dcdcdc;width: 120px;border-radius: 4px;">选择文件夹</div>
    </div>
  </div>
`)
  window.jQuery(()=>{
    /**
     * 创建放置区域
     */
    function createDropArea(){
      if (!inserted) {
        tpl.hide()
        window.jQuery('body').append(tpl)
        window.jQuery('body').append(dragImage)
        inserted = true
        console.log('插入了可拖放区域')
      }
      /*设置各个背景处理事件*/
      window.jQuery('#_fav_drag_box').on('mouseenter',function(){
        console.log('mousenter')
        this.style['background']='#eaeaea'
      })
      window.jQuery('#_fav_drag_box').on('mouseleave',function(){
        console.log('mouseleave')
        this.style['background']='#f1f2f4'
      })
      window.jQuery('.folder').on('mouseenter',function(){
        this.style['background']='#eaeaea'
      })
      window.jQuery('.folder').on('mouseleave',function(){
        this.style['background']='white'
      })
      /*设置各个背景处理事件end*/
      window.jQuery('#_fav_drag_box').on('dragover',function(event){
        event.preventDefault()
      })
      window.jQuery('#_fav_drag_box').on('drop',function(event){
        event.preventDefault()
        var data = event.dataTransfer || event.originalEvent.dataTransfer
        console.log('打算获取图片',data.getData('Text'))
        console.log('放到了收集箱')
        //直传给preload，让它处理
        let parsedData=JSON.parse(data.getData('Text'))
        window.postMessage({
          event:'getContentForFav',
          content:{
            type:'img',
            src:parsedData.src,
            width:parsedData.width,
            height:parsedData.height,
            alt:parsedData.alt
          }
        })
      })

      window.jQuery('img').attr('draggable',true)


    }
    createDropArea()

    window.jQuery(document).bind('dragstart','img',(e)=>{
      setTimeout(()=>{
        window.jQuery('#_fav-modal').show()
      },200)
      var data = event.dataTransfer || event.originalEvent.dataTransfer
      data.setData("Text",JSON.stringify({
        src:e.target.src,
        width:e.target.naturalWidth,
        height:e.target.naturalHeight,
        alt:e.target.alt
      }));
      console.log(e.target.src)
      let dragElement=e.target
      if (dragElement.naturalWidth > 140) {
        var u = 140 / dragElement.width * dragElement.height, canvas = document.createElement('canvas')
        canvas.width = 140, canvas.height = u, canvas.getContext('2d').drawImage(dragElement, 0, 0, 140, u),
          window.jQuery('#drag-images').empty().append(canvas),
          data.setDragImage(canvas, 0, 0)
      }
      console.log('开始拖拽')
      //todo 功能代码

      //window.jQuery('_fav-modal').show()
    })
    window.jQuery(document).bind('dragend',(e)=>{
        window.jQuery('#_fav-modal').hide()
        console.log('拖拽结束')
        // jQuery('#_fav-modal').hide()
      }
    )
  })


  //
  // //解除复制限制来自https://greasyfork.org/zh-CN/scripts/12591
  // document.body.oncopy=null; //去掉当前设置的复制监听
  // document.body.__defineSetter__ && document.body.__defineSetter__("oncopy",function(){}); //禁止修改复制监听
  //
  // Object.defineProperty(document.body, 'oncopy', {
  //   set : function(){}
  // })
  // Object.defineProperties(document.body, {
  //   'oncopy':{
  //     set:function(){}
  //   }
  // })
  //
  // GM_addStyle('.a_left{ float:none; margin-left: auto; margin-right: auto;}')
  //
  // setTimeout(()=>{
  //   //点击全屏按钮、打印按钮后隐藏登录框
  //   jQuery('.newbtn_fullscreen , #fixedFullScreen, .newbtn_print, #fixedPrint, #contextmenudivmouseup, #contextmenudiv').click(function(){
  //     jQuery('#registerOrLoginLayer').hide();
  //     jQuery('[style*="background: rgb(0, 0, 0); position: fixed; opacity: 0.5;"] , [style*="background: rgb(0, 0, 0); opacity: 0.5;"]').hide();
  //   });
  // },1500);
  //
  // var domainlist = ["yytcdn.com", "youku.com", "yinyuetai", "yidianzixun.com", "xmnn.cn", "xinmin.cn", "www.s1979.com", "www.qzone.cc", "www.aipai.com",
  //   "ws.126.net", "vodjk.com", "video.sxrb.com", "v1.cn", "v.mp.uc.cn", "v.ku6vms.com", "v.ifeng.com", "tv189.", "tudou.com",
  //   "tangdou.com", "sohu.com", "smgbb.cn", "sina.com", "qq.com", "qiyi.com", "pptv.com", "pplive.cn", "pomoho.com", "people.com.cn",
  //   "people.com", "pclady.com.cn", "netease.", "mtime.com", "m.toutiao", "letvcdn.com", "letv.com", "le.com", "ku6cdn.com", "kksmg.com",
  //   "jstv.com", "js.tudouui.com", "iqiyi.com", "iqiyi.com", "iqilu.com", "imgo.tv", "ifengimg.com", "ifeng.com", "huanqiu.", "hitvs.cn",
  //   "hitow.net", "haokan.baidu.com", "gmw.cn", "enorth.com", "eastmoney.com", "e23.cn", "douyin.com", "doc88.com", "cztv.com", "cutv.com",
  //   "chinanews.com", "chaoxing.com", "cdstm.cn", "cctv.com", "cctv.com", "boosj.com", "bokecc.com", "bilibili.com", "baomihua.com", "b23.tv",
  //   "av.rednet.cn", "71.cn", "56.com", "365yg.com", "360kan.com", "17173.com", "163.com", ".yidianzixun.com", ".xiguavideo.net",
  //   ".xiguavideo.cn", ".xiguashipin.net", ".xiguashipin.cn", ".xiguaapp.com", ".xiguaapp.cn", ".toutiao.com", ".pstatp.com", ".kuaishou.com",
  //   ".ixigua.com", ".365yg.com", "zhiyin.cn", "yoqoo.com", "xinhuanet.com", "xiaoniangao.cn", "www.legaldaily.com.cn", "www.docin.com",
  //   "www.5872.com", "wenku.baidu.com", "v.rbc.cn", "v.csdn.hudong.com", "v.chinamil.com.cn", "umiwi.com", "static.youku.com","360doc.com",
  //   "resources.pomoho.com", "pps.tv", "pcauto.com.cn", "news.cn", "ku6.com", "jxyinyue.com", "hunantv.com", "hualu5.com", "dv.ce.cn",
  //   "cri.cn yntv.cn", "cntv.cn", "client.joy.cn", "bdchina.com", "6.cn", "21cn.com", "m.docin.com", "m.doc88.com", "wk.baidu.com"];
  //
  // jQuery('#articlecontent a').click(function(){
  //   let href = jQuery(this).attr('href');
  //   let isTrusted = false;
  //   jQuery.each(domainlist, function(index, value) {
  //     if (href.indexOf(value) > -1) {
  //       isTrusted = true;
  //     }
  //   })
  //
  //   if(isTrusted == false) //非可信域名链接直接打开，不弹提示
  //   {
  //     window.open(href);
  //   }
  // });
  //
  // jQuery('.a_left').width(jQuery('.doc360article_content').width()-100);
  // jQuery('#bgchange').width(jQuery('.doc360article_content').width()-100);
  // jQuery('.article_showall + table').width(jQuery('.doc360article_content').width()-100);
  // jQuery('#artContent').attr('style','max-width:'+ (jQuery('.doc360article_content').width()-100) + 'px，width:'+ (jQuery('.doc360article_content').width()-100) + 'px');
  // jQuery('#artContent + div').width(jQuery('.doc360article_content').width()-100);
  //
  //
  // setInterval(()=>{
  //   jQuery('body').removeClass('articleMaxH'); //自动展开全文
  //
  //   //文章内打印按钮
  //   jQuery('.newbtn_print').show();
  //   if(jQuery('.newbtn_print').length>0 && jQuery('.newbtn_print').attr('onclick').indexOf('PrintObj.print()') == -1)
  //   {
  //     jQuery('.newbtn_print').attr('onclick',jQuery('.newbtn_print').attr('onclick')+'PrintObj.print();');
  //   }
  //
  //   //顶部打印按钮
  //   if(jQuery('.atfixednav').css('display')=='block')
  //   {
  //     jQuery('#fixedPrint').show();
  //     if(jQuery('#fixedPrint a').length>0 && jQuery('#fixedPrint a').attr('onclick').indexOf('PrintObj.print()') == -1)
  //     {
  //       jQuery('#fixedPrint a').attr('onclick',jQuery('#fixedPrint a').attr('onclick')+'PrintObj.print();');
  //     }
  //   }
  //
  //   //右键菜单打印按钮
  //   if(jQuery('#contextmenudiv').css('display')=='block')
  //   {
  //     if(jQuery('#contextmenudiv li:nth-of-type(2) a').length>0 && jQuery('#contextmenudiv li:nth-of-type(2) a').attr('onclick').indexOf('PrintObj.print()') == -1)
  //     {
  //       jQuery('#contextmenudiv li:nth-of-type(2) a').attr('onclick',jQuery('#contextmenudiv li:nth-of-type(2) a').attr('onclick')+'PrintObj.print();');
  //     }
  //   }
  //
  //   //文章内转word按钮
  //   jQuery('.newbtn_word').show();
  //   if(jQuery('.newbtn_word').length>0 && jQuery('.newbtn_word').attr('onclick').indexOf('WordObj.htmlToWord()') == -1)
  //   {
  //     jQuery('.newbtn_word').attr('onclick',jQuery('.newbtn_word').attr('onclick')+';WordObj.htmlToWord();');
  //   }
  //
  //   //顶部转word按钮
  //   if(jQuery('.atfixednav').css('display')=='block')
  //   {
  //     jQuery('#fixedWord').show();
  //     if(jQuery('#fixedWord a').length>0 && jQuery('#fixedWord a').attr('onclick').indexOf('WordObj.htmlToWord()') == -1)
  //     {
  //       jQuery('#fixedWord a').attr('onclick',jQuery('#fixedWord a').attr('onclick')+'WordObj.htmlToWord();');
  //     }
  //   }
  //
  //   if(!jQuery('#topnickname a').hasClass('full'))
  //   {
  //     jQuery('#topnickname a').text(jQuery('#topnickname a').attr('title'));
  //     jQuery('#topnickname a').addClass('full');
  //   }
  //
  //
  //   jQuery('#ac_buybook').hide();
  //   jQuery('.floatqrcode').hide();
  //   jQuery('#doc360outlinkpop').hide();
  //   jQuery('#adarttopgoogle').hide();
  //   jQuery('#outerdivifartad1').hide();
  //   jQuery('.str_border').hide();
  //   jQuery('#recommendArt .his_her_div').hide();
  //   jQuery('.clear360doc').hide();
  //   jQuery('newsfeed').hide();
  //   jQuery('#topref').parent().hide();
  //   jQuery('.prev_next').hide();
  //   jQuery('#oranuserinfo').hide();
  //   jQuery('#divreward').hide();
  //   jQuery('#ifartaddiv').hide();
  //   jQuery('#divadright').hide();
  //   jQuery('.index_app2d').hide();
  //   jQuery('.index_app2dclose').hide();
  //   jQuery('.a_right').hide();
  //   jQuery('#goTop2').hide();
  //   jQuery('#arttopbdad').hide();
  //
  //   jQuery('.head2020_mask + div').hide();
  //   jQuery('#divtort + div').hide();
  //   jQuery('.yc_user').hide();
  //   jQuery('.youlike').hide();
  //   jQuery('.lswztit').hide();
  //   jQuery('.like_content').hide();
  //   jQuery('#relearticle').hide();
  //   jQuery('#relevantmorediv').hide();
  //   jQuery('#currbackgroudcolor > div:nth-child(6)').hide();
  // },100);
  //
  // setTimeout(function(){
  //   if(window.location.href.indexOf('www.360doc.cn')>-1 && jQuery('.article_showall a').length>0)
  //   {
  //     jQuery('.article_showall a').get(0).click();
  //     ReShowAll();
  //     closedialog2();
  //   }
  // },1000);

})()
