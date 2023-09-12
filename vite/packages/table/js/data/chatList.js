export const chatList = [
  {
    name: '想天工作台官方社群',
    summary: '欢迎加入想天工作台官方社群，在这里您可以了解到和产品有关的一切',
    settings: {//用户设置的
      enableColumns: false,
    },
    props: {//属性是很少变化的
      enableColumns: false,
    },

    channelList: [
      {
        id: '',
        role: 'category',//代表这个是一个目录
        name: '常用',
        props: {},
        children: [
          {
            id: '',
            role: 'channel',//代表频道
            type: 'group',//代表频道类型 group代表群聊
            name: '闲话畅聊',
            props: { id: 'xianhua' }//相关属性
          },
          {
            role: 'channel', type: 'group', name: '直面开发团队', props: { id: 'develop_group' }
          },
          {
            role: 'channel', type: 'link', title: '阿皮动态',
            props: {
              url: 'https://space.bilibili.com/167397379/video',
              openMethod: 'userSelect'  //根据用户工作台设置
            }
          },
          {
            role: 'channel', type: 'link', title: 'B站视频',
            props: {
              gossipID: '',
              url: 'https://space.bilibili.com/167397379/dynamic'
            }
          }
        ]
      },
      {
        role: 'category',
        name: '产品相关',
        props: {},
        children: [
          {
            role: 'channel', name: '新手入门', type: 'forum', props: {
              id: ''
            },
          },
          {
            role: 'channel', name: '版本更新', type: 'forum', props: {
              id: ''
            },
          },
          { role: 'channel', title: 'Roadmap', type: 'link', props: { url: 'http://kanban.xiangtian.ren/b/Bd6fRiZPo3RTxq9ok/board' } },
        ]
      },
      {
        role: 'category',
        name: '交流群',
        props: {},
        children: [
          { role: 'channel', name: '官方运营', type: 'group', props: {
            id:'yunying'
            } },
          { role: 'channel', name: '群主交流', type: 'group', props: {id:'qunzhu'} },
          { role: 'channel', name: '开发者交流', type: 'group', props: {id:'developer'} },
          { role: 'channel', name: '3D打印', type: 'group', props: {id:'3dprint'} },
          { role: 'channel', name: '3C数码交流', type: 'group', props: {id:'3cdigital'} },
          { role: 'channel', name: '屏幕DIY', type: 'group', props: {id:'screen_diy'} },
          { role: 'channel', name: '游戏玩家交流', type: 'group', props: {id:'player'} },
          { role: 'channel', name: '闲置交易群', type: 'group', props: {id:'trade'} },
        ]
      }
    ]
  }
]
