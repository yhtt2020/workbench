import {leveList,powerList} from "../data/abilityData";

export function powerState(powerType,lv,powerDetail=''){
  //powerType权益类型
  //lv 用户等级
  //powerDetail查找第二层权益 如 查找动态壁纸
 let gradeStratum=leveList[leveList.length-1]
 if(leveList.findIndex( (n)=> n > lv)!==-1) gradeStratum=leveList[leveList.findIndex( (n)=> n > lv)-1]

  const filterList = powerList.filter(item => {
    return item.name===powerType
  })
  const tip = {tipTitle:'',
              blocking:false,
              powerLv:0,
              powerAlias:'',
              superiorLimit:0 }
  if(powerDetail===''){
    if(Object.keys(filterList[0].detail).includes(gradeStratum+'')){
      tip.tipTitle = '已解锁'
      if(filterList[0].detail[1]==='限时体验'){
        tip.tipTitle = '限时'
      }
      tip.blocking = true
if(filterList[0].superiorLimit)tip.superiorLimit = filterList[0].superiorLimit[gradeStratum]
    }else{
      tip.powerLv = Object.keys(filterList[0].detail)[0]
      tip.powerAlias = filterList[0].alias
      tip.tipTitle = 'Lv' + Object.keys(filterList[0].detail)[0]
      tip.blocking = false
    }
  }else{
    for (const key in filterList[0].detail) {
      if(filterList[0].detail[key]===powerDetail){
        if(gradeStratum>=key){
          tip.tipTitle = '已解锁'
          tip.blocking = true
        }else{
          tip.powerLv = key
          tip.tipTitle = 'Lv' + key
          tip.blocking = false
        }
        return tip
      }
    }
  }
  return tip
}
