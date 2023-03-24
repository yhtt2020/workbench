const dataHelper={
  getRate(num,total,fix=1){
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
