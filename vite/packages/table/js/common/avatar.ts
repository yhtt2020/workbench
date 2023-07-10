import {rarityColor} from "./teamAvatar";
import _ from 'lodash-es';

export function avatarTagColor(item) {  // 根据不同头像框级别区分头像框字体色
  const index = _.find(rarityColor, function (o) {
    return o.id === item.frame.rarity
  })
  return {
    background: index.avatar_color,
  }
}

export function textTag(item) {  // 获取头像框级别分类
  const index = _.find(rarityColor, function (o) {
    return o.id === item.frame.rarity
  })
  return index.avatar_tag
}

export function titleTagColor(item) {  // 获取头像框名称颜色
  const index = _.find(rarityColor, function (o) {
    return o.id === item.frame.rarity
  })
  return {
    color: index.avatar_color,
  }
}

export function avatarBgColor(item) { // 根据不同头像框级别匹配头像框背景色
  const index = _.find(rarityColor, function (o) {
    return o.id === item.frame.rarity
  })
  return {
    background: index.bg_color
  }
}
