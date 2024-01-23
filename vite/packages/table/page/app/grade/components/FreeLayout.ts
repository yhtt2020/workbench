
import { defineStore } from 'pinia';
// @ts-ignore
export const FreeLayoutStore = defineStore('FreeLayoutStore', {
  state: () => ({
    // 效率桌面数据
    assistDesk: {
      desk: [
        {
          "name": "效率桌面",
          "id": "_Xc3",
          "icon": "desktop",
          "cards": [
            {
              "name": "TimerClock",
              "id": 1705971205206,
              "customData": {
                "isFull": false,
                "isState": true,
                "customSize": "2x2"
              },
              "data": {}
            },
            {
              "name": "AggregateSearch",
              "id": 1705971216198,
              "customData": {
                "sortType": "work",
                "customSize": "2x2"
              },
              "data": {}
            },
            {
              "name": "notes",
              "id": 1705971265991,
              "customData": {
                "title": "桌面便签",
                "background": "#57BF60",
                "cardSize": "card",
                "colors": "#ffffff",
                "height": 2,
                "width": 1,
                "text": "",
                "dragCardSize": "card",
                "content": "",
                "customSize": "2x4"
              },
              "_id": "note:1705971265991",
              "updateTime": 1705971265991,
              "createTime": 1705971265991,
              "content": "",
              "notes": "notes",
              "isDelete": false,
              "deskName": "空白桌面",
              "deskId": "_Xc3",
              "data": {}
            },
            {
              "name": "AIaides",
              "id": 1705971276167,
              "customData": {
                "customSize": "2x2"
              },
              "data": {}
            },
            {
              "name": "countdownDay",
              "id": 1705971290975,
              "customData": {
                "customSize": "2x2",
                "notRetain": true
              },
              "data": {}
            },
            {
              "name": "Todo",
              "id": 1705971303222,
              "customData": {
                "currentTodo": {
                  "title": "个人",
                  "nanoid": "T00111"
                },
                "width": 1,
                "height": 2
              },
              "data": {}
            },
            {
              "name": "folder",
              "id": 1705971311447,
              "customData": {
                "name": "其他文件",
                "icon": "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
                "list": [],
                "customSize": "2x2",
                "lock": true,
                "layout": "rows",
                "sort": "free",
                "model": "custom",
                "rules": []
              },
              "data": {}
            },
            {
              "name": "folder",
              "id": 1705971312239,
              "customData": {
                "name": "图片",
                "icon": "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
                "list": [],
                "customSize": "2x2",
                "lock": true,
                "layout": "rows",
                "sort": "free",
                "model": "custom",
                "rules": []
              },
              "data": {}
            },
            {
              "name": "folder",
              "id": 1705971312963,
              "customData": {
                "name": "文件夹",
                "icon": "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
                "list": [],
                "customSize": "2x2",
                "lock": true,
                "layout": "rows",
                "sort": "free",
                "model": "custom",
                "rules": []
              },
              "data": {}
            },
            {
              "name": "folder",
              "id": 1705971319015,
              "customData": {
                "name": "音视频",
                "icon": "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
                "list": [],
                "customSize": "2x2",
                "lock": true,
                "layout": "rows",
                "sort": "free",
                "model": "custom",
                "rules": []
              },
              "data": {}
            }
          ],
          "settings": {
            "cardZoom": 100,
            "marginTop": 0,
            "cardMargin": 5,
            "enableZoom": true
          },
          "layoutSize": {
            "width": 0,
            "height": 892
          },
          "deskHeight": 892
        }
      ],
      freeLayoutData: {
        "_Xc3": {
          "1705971205206": {
            "left": 1904,
            "top": 2382,
            "index": 1,
            "id": 1705971205206
          },
          "1705971216198": {
            "left": 1904,
            "top": 2598,
            "index": 1,
            "id": 1705971216198
          },
          "1705971265991": {
            "left": 2196,
            "top": 2382,
            "index": 1,
            "id": 1705971265991
          },
          "1705971276167": {
            "left": 2488,
            "top": 2382,
            "index": 1,
            "id": 1705971276167
          },
          "1705971290975": {
            "left": 2488,
            "top": 2598,
            "index": 1,
            "id": 1705971290975
          },
          "1705971303222": {
            "left": 2780,
            "top": 2382,
            "index": 1,
            "id": 1705971303222
          },
          "1705971311447": {
            "left": 1904,
            "top": 2814,
            "index": 1,
            "id": 1705971311447
          },
          "1705971312239": {
            "left": 2196,
            "top": 2814,
            "index": 1,
            "id": 1705971312239
          },
          "1705971312963": {
            "left": 2488,
            "top": 2814,
            "index": 1,
            "id": 1705971312963
          },
          "1705971319015": {
            "left": 2780,
            "top": 2814,
            "index": 1,
            "id": 1705971319015
          }
        }
      },
      freeLayoutState: {
        "_Xc3": {
          "mode": {
            "arrange": "grid",
            "scroll": "free",
            "align": "custom"
          },
          "system": {
            "isFreeLayout": true,
            "hide": false
          },
          "option": {
            "afterDragging": true,
            "whileDragging": false,
            "collision": true,
            "margin": 6,
            "magnet": false
          },
          "line": {
            "isAuxLine": false,
            "isBorderLine": false,
            "isCenterLine": false,
            "centerLine": {
              "x": 1532,
              "y": 2257
            },
            "centerPosition": {
              "x": "center",
              "y": "top"
            }
          },
          "canvas": {
            "isInfinite": false,
            "zoom": 1,
            "width": 5000,
            "height": 5000
          }
        }
      }
    },
    // 游戏桌面数据
    gameDesk: {
      "desk": [
        {
          "name": "默认布局",
          "id": "gd-r6tCo",
          "icon": "desktop",
          "cards": [
            {
              "name": "middleWallpaper",
              "id": 1705883742578,
              "customData": {
                "name": "拾光壁纸",
                "value": "timeline",
                "label": "拾光壁纸",
                "path": "/timeline/v3",
                "customSize": "2x2",
                "width": 1,
                "height": 1
              },
              "data": {}
            },
            {
              "name": "clocks",
              "id": 1701850990017,
              "customData": {
                "dragCardSize": "card small",
                "width": 1,
                "height": 1,
                "cardSize": "card small",
                "clockId": "clock4",
                "imgUrl": "https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg",
                "blurs": 3,
                "bgZoom": 0,
                "customSize": "2x2"
              },
              "data": {}
            },
            {
              "name": "MyGameSmall",
              "id": 1705906879069,
              "customData": {
                "customSize": "2x4"
              },
              "data": {}
            },
            {
              "name": "audio",
              "id": 1705906887800,
              "customData": {
                "customSize": "2x4"
              },
              "data": {}
            },
            {
              "name": "GameEpic",
              "id": 1705906913821,
              "customData": {
                "customSize": "2x4"
              },
              "data": {}
            },
            {
              "name": "folder",
              "id": 1705906930197,
              "customData": {
                "name": "其他文件",
                "icon": "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
                "list": [],
                "customSize": "2x2",
                "lock": true,
                "layout": "rows",
                "sort": "free",
                "model": "custom",
                "rules": []
              },
              "data": {}
            },
            {
              "name": "folder",
              "id": 1705906937618,
              "customData": {
                "name": "图片",
                "icon": "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
                "list": [],
                "customSize": "2x2",
                "lock": true,
                "layout": "rows",
                "sort": "free",
                "model": "custom",
                "rules": [],
                "modalSize": "6x5"
              },
              "data": {}
            },
            {
              "name": "folder",
              "id": 1705906940636,
              "customData": {
                "name": "文件夹",
                "icon": "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
                "list": [],
                "customSize": "2x2",
                "lock": true,
                "layout": "rows",
                "sort": "free",
                "model": "custom",
                "rules": []
              },
              "data": {}
            },
            {
              "name": "folder",
              "id": 1705906943715,
              "customData": {
                "name": "音视频",
                "icon": "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
                "list": [],
                "customSize": "2x2",
                "lock": true,
                "layout": "rows",
                "sort": "free",
                "model": "custom",
                "rules": [],
                "modalSize": "6x5"
              },
              "data": {}
            }
          ],
          "settings": {
            "cardZoom": 100,
            "marginTop": 0,
            "cardMargin": 6.121147715196599,
            "enableZoom": true,
            "zoom": 0
          },
          "layoutSize": {
            "width": 0,
            "height": 853
          },
          "deskHeight": 853
        }
      ],
      "freeLayoutData": {
        "gd-r6tCo": {
          "1705883742578": {
            "left": 1904,
            "top": 2706,
            "index": 1,
            "id": 1705883742578
          },
          "1701420672541": {
            "left": 2196,
            "top": 2490,
            "index": 1,
            "id": 1701420672541,
            "name": "news"
          },
          "1701420719963": {
            "left": 2488,
            "top": 3138,
            "index": 1,
            "id": 1701420719963,
            "name": "notes"
          },
          "1701420782369": {
            "left": 2488,
            "top": 2922,
            "index": 1,
            "id": 1701420782369,
            "name": "AggregateSearch"
          },
          "1701850971669": {
            "left": 2780,
            "top": 3138,
            "index": 1,
            "id": 1701850971669,
            "name": "AIaides"
          },
          "1701850990017": {
            "left": 1904,
            "top": 2490,
            "index": 1,
            "id": 1701850990017,
            "name": "clocks"
          },
          "1704444814036": {
            "left": 2488,
            "top": 2490,
            "index": 1,
            "id": 1704444814036,
            "name": "folder"
          },
          "1701927774475": {
            "left": 1904,
            "top": 2922,
            "index": 1,
            "id": 1701927774475,
            "name": "yuanCommunity"
          },
          "1702026795921": {
            "left": 2780,
            "top": 2922,
            "index": 1,
            "id": 1702026795921,
            "name": "folder"
          },
          "1705906879069": {
            "left": 2488,
            "top": 2490,
            "index": 1,
            "id": 1705906879069
          },
          "1705906887800": {
            "left": 2780,
            "top": 2490,
            "index": 1,
            "id": 1705906887800
          },
          "1705906913821": {
            "left": 2196,
            "top": 2490,
            "index": 1,
            "id": 1705906913821
          },
          "1705906930197": {
            "left": 1904,
            "top": 2922,
            "index": 1,
            "id": 1705906930197
          },
          "1705906937618": {
            "left": 2196,
            "top": 2922,
            "index": 1,
            "id": 1705906937618
          },
          "1705906940636": {
            "left": 2488,
            "top": 2922,
            "index": 1,
            "id": 1705906940636
          },
          "1705906943715": {
            "left": 2780,
            "top": 2922,
            "index": 1,
            "id": 1705906943715
          }
        }
      },
      "freeLayoutState": {
        "gd-r6tCo": {
          "system": {
            "isFreeLayout": true,
            "hide": false
          },
          "option": {
            "afterDragging": true,
            "whileDragging": false,
            "collision": true,
            "margin": 6,
            "magnet": false
          },
          "line": {
            "isAuxLine": false,
            "isBorderLine": false,
            "isCenterLine": false,
            "centerLine": {
              "x": 1772,
              "y": 2389
            },
            "centerPosition": {
              "x": "center",
              "y": "top"
            }
          },
          "canvas": {
            "isInfinite": false,
            "zoom": 1,
            "width": 5000,
            "height": 5000
          },
          "mode": {
            "arrange": "grid",
            "scroll": "free",
            "align": "custom"
          }
        }
      }

    },

    // 新用户第一次进入默认数据
    deskDefault: [
      {
        "name": "默认布局",
        "id": "kFe3OXrk",
        "icon": "desktop",
        "cards": [
          {
            "name": "middleWallpaper",
            "id": 1705883742578,
            "customData": {
              "name": "拾光壁纸",
              "value": "timeline",
              "label": "拾光壁纸",
              "path": "/timeline/v3",
              "customSize": "2x2",
              "width": 1,
              "height": 1
            },
            "data": {}
          },
          {
            "name": "news",
            "id": 1701420672541,
            "customData": {},
            "data": {}
          },
          {
            "name": "notes",
            "id": 1701420719963,
            "customData": {
              "title": "今日事今日毕",
              "background": "#5898CB",
              "cardSize": "card small",
              "colors": "#ffffff",
              "height": 1,
              "width": 1,
              "text": "“你可以创建多个不同的便签”\n· 整理下周需要演示的产品材料\n· 昨天产品发布会后客户反馈xx功能的使用手册不是很清楚，需要和xx沟通一下\n\n",
              "dragCardSize": "card small",
              "content": "",
              "colorIndex": 5,
              "color": "#ffffff"
            },
            "_id": "note:1701420719963",
            "updateTime": 1701420719963,
            "createTime": 1701420719963,
            "notes": "notes",
            "isDelete": false,
            "deskName": "默认布局",
            "deskId": "P8Yv",
            "data": {}
          },
          {
            "name": "AggregateSearch",
            "id": 1701420782369,
            "customData": {
              "sortType": "work"
            },
            "data": {}
          },
          {
            "name": "AIaides",
            "id": 1701850971669,
            "customData": {},
            "data": {}
          },
          {
            "name": "clocks",
            "id": 1701850990017,
            "customData": {
              "dragCardSize": "card small",
              "width": 1,
              "height": 1,
              "cardSize": "card small",
              "clockId": "clock4",
              "imgUrl": "https://p.ananas.chaoxing.com/star3/origin/fa7d6f2c69aae528484d8278575c28ef.jpg",
              "blurs": 3,
              "bgZoom": 0
            },
            "data": {}
          },
          {
            "name": "folder",
            "id": 1704444814036,
            "customData": {
              "name": "网址导航",
              "icon": "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
              "customSize": "4x4",
              "lock": true,
              "layout": "rows",
              "sort": "free",
              "model": "custom",
              "rules": [],
              "list": [
                {
                  "value": "https://www.suning.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/MH-R-83qc-GXHI-laSg",
                  "name": "苏宁易购",
                  "id": 1704445352177,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.jd.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/1_hc-L4OF-T8H7-l39B",
                  "name": "京东",
                  "id": 1704445352178,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.bilibili.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Y-Uo-cJa1-jL5N-IPtL",
                  "name": "Bilibili",
                  "id": 1704445352179,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://mail.qq.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/fSAt-pt3W--Nzu-rLkD",
                  "name": "QQ邮箱",
                  "id": 1704445352180,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.douyin.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/1dFZ-0VRv-uit8-62IR",
                  "name": "抖音",
                  "id": 1704445352181,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.huya.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/9MKq-nRHZ-Z96c-uWCJ",
                  "name": "虎牙直播",
                  "id": 1704445352182,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.youdao.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/53IC-w2Q7-zeP7-0wwI",
                  "name": "有道云笔记",
                  "id": 1704445352183,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.ithome.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/ij5Y-_Eh0-VYhy-0qHl",
                  "name": "IT之家",
                  "id": 1704445352184,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.douyu.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/pVap-fwn0-1ci1-8xtf",
                  "name": "斗鱼直播",
                  "id": 1704445352185,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.zhihu.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/VJPp-YaUC-DJ5z-7CYK",
                  "name": "知乎",
                  "id": 1704445352186,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.qunar.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/lpJ9-7S_6-ZrG_-Baaw",
                  "name": "去哪儿网",
                  "id": 1704445352187,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.autohome.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/IKTS-pPCb-c2bo-zQn7",
                  "name": "汽车之家",
                  "id": 1704445352188,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.12306.cn/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/CybC-Ll9b-dwSJ-HVdb",
                  "name": "12306",
                  "id": 1704445352189,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.weibo.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/SlAb-g1-F-hzxV-GTb7",
                  "name": "新浪微博",
                  "id": 1704445352190,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://tieba.baidu.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/VP5g-Z3w9-i8Wz-_X78",
                  "name": "百度贴吧",
                  "id": 1704445352191,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.toutiao.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/9qsx-7Shw-ov9b-FAZs",
                  "name": "今日头条",
                  "id": 1704445352192,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.yinxiang.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/Klzm-_gyF-VXVS-jcZP",
                  "name": "印象笔记",
                  "id": 1704445352193,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.ximalaya.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/v-p5-gnLB-pLUh-WasE",
                  "name": "喜马拉雅",
                  "id": 1704445352194,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://yiyun.baidu.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/f1pj-GvSO-4fER-pagF",
                  "name": "百度网盘",
                  "id": 1704445352195,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.ctrip.com",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/2-YC-C8Bk-rX9g-Ky7h",
                  "name": "携程网",
                  "id": 1704445352196,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.taobao.com",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/GK3C-skR8-9wpd-ueqY",
                  "name": "淘宝",
                  "id": 1704445352197,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.youku.com",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/vk7N-wzvs-Xb77-WJKf",
                  "name": "优酷视频",
                  "id": 1704445352198,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.hupu.com",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/aQoc-dpnp-VUeP-QbP9",
                  "name": "虎扑体育",
                  "id": 1704445352199,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.douban.com",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/-i8e-7HAS-HF6Z-x5oP",
                  "name": "豆瓣",
                  "id": 1704445352200,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.wegame.com.cn/home",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/5ePd-W1jo-XhHW-SZdU",
                  "name": "WeGame",
                  "id": 1704445352201,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
              ],
            },
            "data": {}
          },
          {
            "name": "yuanCommunity",
            "id": 1701927774475,
            "customData": {
              "forumList": [
                {
                  "id": 100304,
                  "name": "版本更新",
                  "title": "工作台用户专属",
                  "status": 1,
                  "logo": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/8befa3834d2eb29e75685563ef513215.png?upload_type/Tencent_COS",
                  "creator": 1,
                  "display": 1
                }
              ],
              "selectList": [
                {
                  "index": 0,
                  "value": {
                    "id": 100304,
                    "name": "版本更新",
                    "title": "工作台用户专属",
                    "status": 1,
                    "logo": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/8befa3834d2eb29e75685563ef513215.png?upload_type/Tencent_COS",
                    "creator": 1,
                    "display": 1
                  }
                }
              ],
              "defaultForum": {
                "index": 0,
                "value": {
                  "id": 100304,
                  "name": "版本更新",
                  "title": "工作台用户专属",
                  "status": 1,
                  "logo": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/8befa3834d2eb29e75685563ef513215.png?upload_type/Tencent_COS",
                  "creator": 1,
                  "display": 1
                }
              }
            },
            "data": {}
          },
          {
            "name": "folder",
            "id": 1702026795921,
            "customData": {
              "name": "常用软件",
              "icon": "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
              "size": "2x2",
              "lock": true,
              "layout": "rows",
              "sort": "free",
              "model": "custom",
              "rules": [],
              "list": [
                {
                  "value": "https://www.suning.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/MH-R-83qc-GXHI-laSg",
                  "name": "苏宁易购",
                  "id": 1704445352205,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
                {
                  "value": "https://www.jd.com/",
                  "icon": "https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/1_hc-L4OF-T8H7-l39B",
                  "name": "京东",
                  "id": 1704445352206,
                  "useCount": 0,
                  "lastUseTime": "",
                  "mode": "link",
                  "type": "default",
                  "iconState": "cover",
                  "iconShape": "square",
                  "isName": true,
                  "bg": "",
                  "isBg": false,
                  "radius": 5,
                  "isRadius": true,
                },
              ],
            },
            "data": {}
          },
        ],
        "settings": {
          "cardZoom": 100,
          "marginTop": 0,
          "cardMargin": 6.121147715196599,
          "enableZoom": true,
          "zoom": 0
        },
        "layoutSize": {
          "width": 0,
          "height": 853
        },
        "deskHeight": 853
      }
    ],
    freeLayoutDataTmp: {
      "kFe3OXrk": {
        "1705883742578": {
          "left": 1904,
          "top": 2706,
          "index": 1,
          "id": 1705883742578
        },
        "1701420672541": {
          "left": 2196,
          "top": 2490,
          "index": 1,
          "id": 1701420672541,
          "name": "news"
        },
        "1701420719963": {
          "left": 2488,
          "top": 3138,
          "index": 1,
          "id": 1701420719963,
          "name": "notes"
        },
        "1701420782369": {
          "left": 2488,
          "top": 2922,
          "index": 1,
          "id": 1701420782369,
          "name": "AggregateSearch"
        },
        "1701850971669": {
          "left": 2780,
          "top": 3138,
          "index": 1,
          "id": 1701850971669,
          "name": "AIaides"
        },
        "1701850990017": {
          "left": 1904,
          "top": 2490,
          "index": 1,
          "id": 1701850990017,
          "name": "clocks"
        },
        "1704444814036": {
          "left": 2488,
          "top": 2490,
          "index": 1,
          "id": 1704444814036,
          "name": "folder"
        },
        "1701927774475": {
          "left": 1904,
          "top": 2922,
          "index": 1,
          "id": 1701927774475,
          "name": "yuanCommunity"
        },
        "1702026795921": {
          "left": 2780,
          "top": 2922,
          "index": 1,
          "id": 1702026795921,
          "name": "folder"
        }
      }
    },
    freeLayoutStateTmp: {
      "kFe3OXrk": {
        "system": {
          "isFreeLayout": true,
          "hide": false
        },
        "option": {
          "afterDragging": true,
          "whileDragging": false,
          "collision": true,
          "margin": 6,
          "magnet": false
        },
        "line": {
          "isAuxLine": false,
          "isBorderLine": false,
          "isCenterLine": false,
          "centerLine": {
            "x": 2482,
            "y": 2488
          },
          "centerPosition": {
            "x": "center",
            "y": "top"
          }
        },
        "canvas": {
          "isInfinite": false,
          "zoom": 1,
          "width": 5000,
          "height": 5000
        }
      }
    }

  }),
  actions: {},
  persist: {
    enabled: true,
    strategies: [{
      // 自定义存储的 key，默认是 store.$id
      // 可以指定任何 extends Storage 的实例，默认是 sessionStorage
      // storage: dbStorage,
      // state 中的字段名，按组打包储存
    }]
  }
})
