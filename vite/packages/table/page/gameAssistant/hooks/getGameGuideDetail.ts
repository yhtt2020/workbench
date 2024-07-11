// 获取游戏攻略详情
import axios from "axios";
import * as cheerio from "cheerio";
import _ from "lodash-es";

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
    const pageContent = rs.data;
    const $ = cheerio.load(pageContent);
    const elList = $(".Mid2 .Mid2_L .txtlist").children();
    // 获取图文攻略数据
    const textList = _.map(elList, (el: any) => {
      const $el = $(el)?.eq(0)?.children()?.eq(0)?.children();
      const $elLink = $(el)?.eq(0)?.children()?.eq(2)?.children();

      // 攻略详情链接
      const url = $elLink?.eq(0)?.text();
      // 时间
      const time = $elLink?.eq(1)?.text();
      // 游戏攻略介绍
      const summary = $($el)?.text();

      return {
        url: url,
        time: time,
        summary: summary,
      };
    });

    //  过滤列表数据参数是否为空
    const filterList = _.filter(textList, (item: any) => {
      if (item.summary !== "") {
        return item;
      }
    });
    return {
      status: 200,
      data: filterList,
    };
  }
}
