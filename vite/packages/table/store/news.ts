import { defineStore } from "pinia";
import axios from "axios";
import dbStorage from "./dbStorage";

export const newsStore = defineStore('news', {
  state: () => ({
    NewsMsgList: [
      {
        "uniquekey": "b4224241289251bb633a9900bf7d7714",
        "title": "乌军提前“热身”，无人机袭击俄军机场，图22轰炸机当场变废铁",
        "date": "2023-08-22 11:41:00",
        "category": "军事",
        "author_name": "国际时事讲解",
        "url": "https://mini.eastday.com/mobile/230822114155442108028.html",
        "thumbnail_pic_s": "https://dfzximg02.dftoutiao.com/minimodify/20230822/640x427_64e42e80efe3a_mwpm_03201609.jpeg",
        "thumbnail_pic_s02": "https://dfzximg02.dftoutiao.com/minimodify/20230822/640x395_64e42e81a48ef_mwpm_03201609.jpeg",
        "thumbnail_pic_s03": "https://dfzximg02.dftoutiao.com/minimodify/20230822/640x360_64e42e825df1e_mwpm_03201609.jpeg",
        "is_content": "1"
    },
    {
        "uniquekey": "309346f096c16dde540fec4d9fea2aee",
        "title": "苏丹快速支援部队宣布控制喀土穆南部一军事基地",
        "date": "2023-08-22 11:19:00",
        "category": "军事",
        "author_name": "国际时事讲解",
        "url": "https://mini.eastday.com/mobile/230822111913872784712.html",
        "thumbnail_pic_s": "",
        "is_content": "1"
    },
    {
        "uniquekey": "315afafc21340b71ddb3dc8416bb55fb",
        "title": "韩美联演启动前夕 金正恩视察朝鲜海军观摩射弹",
        "date": "2023-08-22 11:10:00",
        "category": "军事",
        "author_name": "国际时事讲解",
        "url": "https://mini.eastday.com/mobile/230822111016386892938.html",
        "thumbnail_pic_s": "",
        "is_content": "1"
    },
    {
        "uniquekey": "8849d37c0679d55185ee8e50f0cb67d2",
        "title": "俄方警告！“将动用所有武器”",
        "date": "2023-08-22 11:06:00",
        "category": "军事",
        "author_name": "国际时事讲解",
        "url": "https://mini.eastday.com/mobile/230822110658624363241.html",
        "thumbnail_pic_s": "",
        "is_content": "1"
    },
    {
        "uniquekey": "b9b0381efe834d67cb11933e0c1a1e7d",
        "title": "俄军展示被俘乌军装甲战车 车身上印有美国国旗",
        "date": "2023-08-22 11:05:00",
        "category": "军事",
        "author_name": "国际时事讲解",
        "url": "https://mini.eastday.com/mobile/230822110509429755213.html",
        "thumbnail_pic_s": "",
        "is_content": "1"
    },
    {
        "uniquekey": "62dd0d777b12cb00ce5e4c72e8f81e55",
        "title": "伊朗快艇伴随美军“巴丹”号航母穿过霍尔木兹海峡",
        "date": "2023-08-22 11:00:00",
        "category": "军事",
        "author_name": "国际时事讲解",
        "url": "https://mini.eastday.com/mobile/230822110054897260466.html",
        "thumbnail_pic_s": "",
        "is_content": "1"
    },
    {
        "uniquekey": "c4d99a705f375f131a80d6936a1bb35e",
        "title": "印度“月船三号”完成降轨 预计将于23日晚着陆",
        "date": "2023-08-22 10:53:00",
        "category": "军事",
        "author_name": "国际时事讲解",
        "url": "https://mini.eastday.com/mobile/230822105329222277751.html",
        "thumbnail_pic_s": "https://dfzximg02.dftoutiao.com/minimodify/20230822/600x360_64e42328b3294_mwpm_03201609.jpeg",
        "is_content": "1"
    },
    {
        "uniquekey": "70629b2f010b495c19a8f839b43e86bf",
        "title": "F-35在叙上空“危险靠近”苏-35 俄飞行员及时避让",
        "date": "2023-08-22 10:53:00",
        "category": "军事",
        "author_name": "国际时事讲解",
        "url": "https://mini.eastday.com/mobile/230822105304843541982.html",
        "thumbnail_pic_s": "",
        "is_content": "1"
    }
    ],
  }),
  actions: {
    /**
     * @param {string} tag 
     * @param {number} num 
     * @returns {array} 
     */
    // async getNewsMsg(tag, num) {
    //   try {
    //     let response = await axios.get('http://v.juhe.cn/toutiao/index', {
    //       params: {
    //         type: tag,
    //         page_size: num,
    //         key: '2ce91c43301c9528f2f9d1cd6f310e2b',
    //       }
    //     });

    //     if (response.data.reason === 'success') {
    //       this.NewsMsgList = response.data.result.data;
    //       return this.NewsMsgList;
    //     }
    //   } catch (error) {
    //     throw new Error(error);
    //   }
      
    //   return []; 
    // },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: dbStorage,
        paths: ['NewsMsgList'],
      }
    ]
  }
});
