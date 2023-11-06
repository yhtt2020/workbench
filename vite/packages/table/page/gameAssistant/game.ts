import {steamUserStore} from "../../store/steamUser";

export function isHide(type='steam',id){
  if(steamUserStore().settings.showHideGame){
    return false
  }
  return steamUserStore().hideGames.some(item=>{
    return (item.type===type && item.id===id)
  })
}
