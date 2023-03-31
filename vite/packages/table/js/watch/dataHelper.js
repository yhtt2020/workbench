const dataHelper = {
  /**
   * 获得比例，自动修正带万数据
   * @param num
   * @param total
   * @param fix
   * @returns {string}
   */
  getRate (num, total, fix = 1) {
    if (typeof num === 'undefined' || typeof total === 'undefined') {
      return '-'
    }
    num = dataHelper.convertWan(num)
    total = dataHelper.convertWan(total)
    return (num / total * 100).toFixed(fix)
  },

  convertWan (num) {
     num = String(num)
    if (num.indexOf('万') > -1) {
      num = num.replace('万', '')
      num = Number(num) * 10000
    }

    return Number(num)
  },

  /**
   * 是否高于标准水平，返回true是，返回false否
   */
  aboveStandard (type, value, standard) {
    if (!standard[type]) {
      return true
    }
    return value > standard[type]
  },
  /**
   * 格式化，千+逗号
   * @param num
   * @returns {*|string}
   */
  format (num) {
    if (String(num).indexOf('万') > -1) {
      //已经是格式化文本
      return num
    }
    if (Number(num) > 0) {
      return (Number(num)).toLocaleString()
    } else {
      return '-'
    }

  },
}

export default dataHelper
