import {rarityColor} from "./teamAvatar";
import _ from 'lodash-es';

/**
 * 根据不同头像框级别区分头像框字体色
 * @param rarity
 */
export function avatarTagColor(rarity) {
  const index = _.find(rarityColor, function (o) {
    return o.id === rarity
  })
  return {
    background: index.avatar_color,
  }
}

/**
 * 获取头像框级别分类
 * @param rarity
 */
export function textTag(rarity) {
  const index = _.find(rarityColor, function (o) {
    return o.id === rarity
  })
  return index.avatar_tag
}

/**
 * 获取头像框名称颜色
 * @param rarity
 */
export function titleTagColor(rarity) {
  const index = _.find(rarityColor, function (o) {
    return o.id === rarity
  })
  return {
    color: index.avatar_color,
  }
}

/**
 * 根据不同头像框级别匹配头像框背景色
 * @param rarity
 */
export function avatarBgColor(rarity) {
  const index = _.find(rarityColor, function (o) {
    return o.id === rarity
  })
  return {
    background: index.bg_color
  }
}

export function avatarGainMethodText(gainMethod){
   return  gainMethod.replaceAll('event','活动').replaceAll('sign','签到').replaceAll('store','商店').replace(',','，').replaceAll('rank','排行榜')
}
