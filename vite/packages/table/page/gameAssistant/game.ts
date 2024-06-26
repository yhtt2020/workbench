import {steamUserStore} from "../../store/steamUser";

export function isHide(type='steam',id:any){
  if(steamUserStore().settings.showHideGame){
    return false
  }
  return steamUserStore().hideGames.some((item:any)=>{
    return (item.type===type && item.id===id)
  })
}

export function getHide(type='steam',id){
  return steamUserStore().hideGames.some((item:any)=>{
    return (item.type===type && item.id===id)
  })
}

// 提取steam游戏请求路径
export const getEpicUrl = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?";
// 提取游戏特惠请求路径
export const getPreferenceUrl = "https://store.steampowered.com/api/featuredcategories/";

