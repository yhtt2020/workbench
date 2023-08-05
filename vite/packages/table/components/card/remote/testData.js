export const dataList = [
  {
    nanoid: 'edrg',
    "name": "remote",
    "cname": "俄罗斯方块小游戏",
    "detail": "一个可以在桌面直接使用的俄罗斯方块小游戏",
    url: 'https://chvin.github.io/react-tetris/',
    sizes: ['2x4'],
    option: [
      {
        img: 'http://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/zyRq-433l-GB4b-N-x8',
        name: 'Remote',
        size: '2x4',
        zoom: '11'
      },
    ],
    "time": 1685460400000,
    "download": 7351,
    "avatar": '/icons/logo128.png',
    "nickname": 'Victor Ruiz',
  },
  {
    nanoid: 'qqsd',
    "name": "remote",
    "cname": "键盘减压小游戏",
    "detail": "地址：http://magickeyboard.io/",
    "url": "http://magickeyboard.io/",
    "sizes": ['4x4'],
    "option": [
      {
        img: 'http://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/_uA--L0N8-0KYe-ZCKm',
        "name": "Remote",
        "size": '4x4',
        "zoom": "11"
      }
    ],
    "time": 1685462400000,
    "download": 9710,
    "avatar": '/icons/logo128.png',
    "nickname": 'Russell Morgan',
  }, 
  {
    nanoid: '6hgd',
    "name": "remote",
    "cname": "鼠标水纹小游戏",
    "detail": "地址：https://sciecode.com/soothe/",
    "url": "https://sciecode.com/soothe/",
    "sizes": ['2x4'],
    "option": [
      {
        img: 'http://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/-TmB-Ds3P-3qR6-Tqu5',
        name: 'Remote',
        size: '2x4',
        zoom: '11'
      },
    ],
    "time": 1635462100000,
    "download": 111,
    "avatar": '/icons/logo128.png',
    "nickname": 'Edith Harvey',
  }, 
  {
    nanoid: 'mjyi',
    "name": "remote",
    "cname": "Ant Design Vue",
    "detail": "地址：https://www.antdv.com/components/overview-cn",
    "url": "地址：https://www.antdv.com/components/overview-cn",
    "sizes": ['2x4'],
    "option": [
      {
        img: 'https://aliyuncdn.antdv.com/form/static/assets/landing-config.4f9d5425.png',
        name: 'Remote',
        size: '2x4',
        zoom: '11'
      },
    ],
    "time": 1685462430000,
    "download": 645,
    "avatar": '/icons/logo128.png',
    "nickname": 'Edith Harvey',
  }, 
]
export const shareList = []

export const setList = function(val){
  shareList.push(val)
}

export const delList = function(id){
  shareList.map((item,index) => {
    if(item.nanoid === id)shareList.splice(index,1)
  })
}