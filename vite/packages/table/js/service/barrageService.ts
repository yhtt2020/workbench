import {appStore} from "../../store";

export const barrageService={
  filteredBarrages:[],
  sendBarragesCount:[],
  /**
   * 通过计数的方式进行弹幕的屏蔽
   */
  filterBarrages(list) {
    barrageService.filteredBarrages = JSON.parse(localStorage.getItem('filteredBarrages')) || []
    barrageService.sendBarragesCount = JSON.parse(localStorage.getItem('sendBarragesCount')) || {}
    let sendList = list.filter(barrage => {
      if (barrageService.filteredBarrages.indexOf(barrage.nanoid) > -1)//已经被屏蔽了
      {
        return false
      }
      if (!barrageService.sendBarragesCount[barrage.nanoid]) {
        barrageService.sendBarragesCount[barrage.nanoid] = 1
      } else {
        barrageService.sendBarragesCount[barrage.nanoid]++
      }
      if (barrageService.sendBarragesCount[barrage.nanoid] > appStore().settings.barrage.repeat) {
        barrageService.filteredBarrages.push(barrage.nanoid)//加入屏蔽列表
        delete barrageService.sendBarragesCount[barrage.nanoid] //移除屏蔽记录
        return false
      }
      return true//幸存下来的予以推送
    })
    localStorage.setItem('filteredBarrages', JSON.stringify(barrageService.filteredBarrages))
    localStorage.setItem('sendBarragesCount', JSON.stringify(barrageService.sendBarragesCount))
    //存入两个值
    return sendList

  },

  send(data){
    window.$manager.send(barrageService.filterBarrages([data]))//进行前置过滤
    window.$manager.start()
  }
}
