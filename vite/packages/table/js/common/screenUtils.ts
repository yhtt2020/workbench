function getSign():string{
  let href=window.location.href
  if(href.startsWith('tsbapp://./')){
    return 'table.com'
  }else if(href.startsWith('http://localhost:1600')){
    return 'table.com'
  }else{
    let url=new URL(href)
    return url.hostname
  }
}

/**
 * 判断是不是主屏
 */
function isMain(){
  let sign=getSign()
  return sign === 'table.com';
}
function isWin(){
  return process.platform==='win32'
}
export {
  getSign,isMain,isWin
}
