const grade={
  /**获取当前等级剩余的升级时长，单位为分钟
   * @param lv
   * @param cumulativeMinute
   */
  getRemain(lv,cumulativeMinute){
    console.log('等级',lv)
    console.log('总时长fen中',cumulativeMinute)
    let section = grade.gradeTableGenerate(64)[lv + 1]
    let remain = section[0] * 60 - cumulativeMinute
    return remain
  },
  /**
   * 生成等级图谱，从1-64级的图谱
   * @param num
   */
  gradeTableGenerate (num) {
    let lvSys = {}
    for (let i = 0; i < num + 1; i++) {
      let arrLef = 0
      let arrRg = 0
      for (let j = 0; j < i; j++) {
        arrLef += 10 * (j + 2)
      }
      for (let k = 0; k < i + 1; k++) {
        arrRg += 10 * (k + 2)
      }
      arrRg -= 1
      lvSys[`${i}`] = [arrLef, arrRg]
    }
    delete lvSys['lv0']
    return lvSys
  },
}

export default grade
