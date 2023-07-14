import {rarityColor} from "./teamAvatar";
import _ from 'lodash-es';
import {head} from "lodash";
/**
 * 根据不同头像框级别区分头像框字体色
 * @param rarity
 */
export function avatarTagColor(rarity) {
  const index = _.find(rarityColor, function (o) {
    return o.id === rarity
  })
  return {
    background: index?.avatar_color,
  }
}

/**
 * 获取头像框级别分类
 * @param rarity
 */
export function textTag(rarity) {
  const index = _.find(rarityColor, function (o) {
    return o.id === rarity
  })
  return index?.avatar_tag
}

/**
 * 获取头像框名称颜色
 * @param rarity
 */
export function titleTagColor(rarity) {
  const index = _.find(rarityColor, function (o) {
    return o.id === rarity
  })
  return {
    color: index?.avatar_color,
  }
}

/**
 * 根据不同头像框级别匹配头像框背景色
 * @param rarity
 */
export function avatarBgColor(rarity) {
  const index = _.find(rarityColor, function (o) {
    return o.id === rarity
  })
  return {
    background: index?.bg_color
  }
}

/**
 * 获取稀有度边框颜色
 * @param rarity
 * @param borderSize
 * **/
export function rarityBorderColor(borderSize,rarity){
  const index = _.find(rarityColor, function (o) {
    return o.id === rarity
  })
  return {
    border:`${borderSize}px solid ${index?.color}`
  }
}

export function avatarGainMethodText(gainMethod){
   return  gainMethod.replaceAll('event','活动').replaceAll('sign','签到').replaceAll('store','商店').replace(',','，').replaceAll('rank','排行榜')
}



export function drawHeaderImage(CANVAS_WIDTH,CANVAS_HEIGHT,headSize,frameSize,frame,avatar,cb){
  let canvas,ctx

// 初始化canvas
  function initCanvas() {
    canvas =document.createElement('canvas')
    canvas.width=CANVAS_WIDTH
    canvas.height=CANVAS_HEIGHT
    ctx = canvas.getContext('2d');
    ctx.fillStyle='#00000000'
    // // 解决canvas绘图模糊问题
    // canvas.width = CANVAS_WIDTH * dpr
    // canvas.height = CANVAS_HEIGHT * dpr
    // ctx.scale(dpr, dpr)
  }
  // 生成图片
  function drawImage() {
    // 背景
    ctx.fillStyle = '#00000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    // 背景
    const backImg = new Image()
    backImg.setAttribute("crossOrigin",'Anonymous')
    backImg.src =frame //背景图片 shareBack
    const backImgLoadPromise = new Promise((resolve) => {
      backImg.onload = () => {
        resolve(backImg)
      }
    })
    // 头像
    const userImg = new Image()
    userImg.setAttribute("crossOrigin",'Anonymous')
    userImg.src =avatar// 头像图片this.props.userIcon || avatarDefault
    const userImgLoadPromise = new Promise((resolve) => {
      userImg.onload = () => {
        resolve(userImg)
      }
    })

    return Promise.all([backImgLoadPromise,userImgLoadPromise]).then(res => {
      return Promise.resolve(res)
    })

  }
  initCanvas()
  //绘制圆形图片
  function drawCricleImg(ctx, url, x, y, width, height){
    var avatarurl_width = width;
    var avatarurl_heigth = height;
    var avatarurl_x = x;
    var avatarurl_y = y;
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
    ctx.clip();
    ctx.drawImage(url, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
    ctx.restore();
  }
  drawImage().then(res=>{

    ctx.restore()
    drawCricleImg(ctx,res[1],CANVAS_WIDTH/2-headSize/2,CANVAS_HEIGHT/2-headSize/2,headSize,headSize)
    ctx.drawImage(res[0], 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT) //绘制背景
   // const canvasImg = canvas.toDataURL('image/png',1)
    cb(canvas,ctx)
  })
}
