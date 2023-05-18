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
  console.log(sign)
  return sign === 'table.com';
}

export {
  getSign,isMain
}