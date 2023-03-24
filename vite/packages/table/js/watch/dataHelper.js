const dataHelper={
  getRate(num,total,fix=1){
    if(typeof num ==='undefined' || typeof total==='undefined'){
      return '-'
    }
    console.log(num)
    if(num.indexOf('万')>-1){
      num= num.replace('万','')
      num=Number(num)*10000
    }else {
      total=total.replace('万','')
      num=Number(num)
    }
    if(total.indexOf('万')>-1){
      total=Number(total)*10000
    }
    console.log(num)
    console.log(total)
    return (num/total*100).toFixed(fix)
  },

  /**
   * 是否高于标准水平，返回true是，返回false否
   */
  aboveStandard(type,value,standard){
    if(!standard[type]){
      return true
    }
    return value>standard[type]
  }
}

export default dataHelper
