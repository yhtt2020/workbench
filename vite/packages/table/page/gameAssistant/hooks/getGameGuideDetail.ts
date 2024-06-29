// 获取游戏攻略详情
import { $, callback } from "../../../../../../src/appPreload/app";
import axios from "axios";

// 获取b站的API
export class GetBiliData {
  // 搜索的api
  async biliSearch(keyWord: any) {
    const newKeyWord = encodeURIComponent(keyWord);
    const url = `https://api.bilibili.com/x/web-interface/wbi/search/all?keyword=${newKeyWord}`;
    const rs = await axios.get(url);
    return rs;
  }
}

// 获取游戏攻略图文的API
export class GetImgTextData {
  // 搜索
  async imgTextSearch(keyWord: any) {
    const newKeyWord = encodeURIComponent(keyWord);
    const url = `https://so.gamersky.com/all/handbook?s=${newKeyWord}`;
    const rs = await axios.get(url);
    console.log('测试',rs);
    
  }
}
