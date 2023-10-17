export const chatList = [
  {
    name: '想天工作台官方社群',
    cno:1,
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
            id: 1,
            role: 'channel',//代表频道
            type: 'group',//代表频道类型 group代表群聊
            name: '闲话畅聊',
            props: { id: 'xianhua' }//相关属性
          },
          {
            id:2,
            role: 'channel', type: 'group', name: '直面开发团队', props: { id: 'develop_group' }
          },
          {
            id:3,
            role: 'channel', type: 'link', name: '阿皮动态',
            props: {
              url: 'https://space.bilibili.com/167397379/video',
              openMethod: 'userSelect'  //根据用户工作台设置 不填写openMethod则以iframe加载。部分网页无法正常加载。
            }
          },
          {
            id:4,
            role: 'channel', type: 'link', name: 'B站视频',
            props: {
              gossipID: '',
              url: 'https://space.bilibili.com/167397379/dynamic',
              openMethod: 'userSelect'  //根据用户工作台设置
            }
          }
        ]
      },
      {
        id:5,
        role: 'category',
        name: '产品相关',
        props: {},
        children: [
          {
            id:444444,
            role: 'channel', name: '新手入门', type: 'forum', props: {
              id: 3
            },
          },
          {
            id:32,
            role: 'channel', name: '版本更新', type: 'forum', props: {
              id: 100304
            },
          },
          {
            id:35,
            role: 'channel',
            name: 'Roadmap',
            type: 'link',
            props: { url: 'http://kanban.xiangtian.ren/b/Bd6fRiZPo3RTxq9ok/board' }
          },
        ]
      },
      {
        id:6,
        role: 'category',
        name: '交流群',
        props: {},
        children: [
          {
            id:324,
            role: 'channel', name: '官方运营', type: 'group', props: {
              id: 'yunying'
            }
          },
          {id:'333', role: 'channel', name: '群主交流', type: 'group', props: { id: 'qunzhu' } },
          {id:'444',  role: 'channel', name: '开发者交流', type: 'group', props: { id: 'developer' } },
          {id:'555',  role: 'channel', name: '3D打印', type: 'group', props: { id: '3dprint' } },
          {id:'666',  role: 'channel', name: '3C数码交流', type: 'group', props: { id: '3cdigital' } },
          {id:'777',  role: 'channel', name: '屏幕DIY', type: 'group', props: { id: 'screen_diy' } },
          {id:'888',  role: 'channel', name: '游戏玩家交流', type: 'group', props: { id: 'player' } },
          {id:'999',  role: 'channel', name: '闲置交易群', type: 'group', props: { id: 'trade' } },
        ]
      }
    ]
  }
]


export const hideDropList = [
  {icon:'fluent:people-add-16-regular',title:'邀请其他人',type:'invited'},
  {icon:'fluent:apps-add-in-20-filled',title:'添加新应用',type:'apply'},
  {icon:'fluent:add-16-filled',title:'添加新分组',type:'category'},
  // {icon:'',title:'社群管理',type:'manage'},
  // {icon:'ant-design:team-outlined',title:'成员管理',type:'manage'},
  {icon:'fluent:text-indent-decrease-16-filled',title:'收起边栏',type:'hidden'},
  {icon:'fluent:apps-list-detail-24-regular',title:'切换双/单列',type:'change'},

]

export const showDropList = [
  {icon:'fluent:people-add-16-regular',title:'邀请其他人',type:'invited'},
  {icon:'fluent:apps-add-in-20-filled',title:'添加新应用',type:'apply'},
  {icon:'fluent:add-16-filled',title:'添加新分组',type:'category'},
  {icon:'fluent:text-indent-decrease-16-filled',title:'展开边栏',type:'show'},
  // {icon:'',title:'社群管理',type:'manage'},
  // {icon:'ant-design:team-outlined',title:'成员管理',type:'manage'}
]

export const memberDropList = [
  {icon:'fluent:text-indent-decrease-16-filled',title:'收起边栏',type:'hidden'},
  {icon:'fluent:apps-list-detail-24-regular',title:'切换双/单列',type:'change'},
]


export const memberShowList = [
  {icon:'fluent:text-indent-decrease-16-filled',title:'展开边栏',type:'show'},
  {icon:'fluent:apps-list-detail-24-regular',title:'切换双/单列',type:'change'},
]

export const categoryMenu = [
  { icon:'fluent:apps-add-in-20-filled',title:'添加新应用',type:'addNewApp' },
  { icon:'fluent:settings-16-regular',title:'分组设置',type:'packetSet'},
  { icon:'akar-icons:trash-can',title:'删除分组',type:'deletePacket' }
 ]

export const channelMenu = [
  { icon:'fluent:settings-16-regular',title:'链接设置',type:'linkSet'},
  { icon:'akar-icons:trash-can',title:'删除应用',type:'deleteApp' },
]


export const hotCommunityData = [
  {
    createTime: '2023-09-15 14:01:23',
    updateTime: '2023-09-19 14:25:29',
    no: 1000010,
    name: '死亡细胞交流社群',
    icon:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/rUGl-XZl6-9NLy-tHEq',
    summary:'玩家扮演一名不死战士，探索一个由各种敌人和陷阱构成的迷宫。',
    type: 'public',
    joinOption: 'freeAccess',
    inviteOption: 'freeAccess',
    memberNum: 10,
    ownerUid: 2469,
    level: 6,
    adminUids: "",
    status: 1,
  },
  {
    createTime: '2023-09-15 14:01:23',
    updateTime: '2023-09-19 14:25:29',
    no: 100008,
    name: '永劫无间交流社群',
    icon:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/rUGl-XZl6-9NLy-tHEq',
    summary:'由网易旗下“24 Entertainment工作室”开发的一款多人动作竞技游戏。',
    type: 'public',
    joinOption: 'freeAccess',
    inviteOption: 'freeAccess',
    memberNum: 2,
    ownerUid: 2469,
    level: 6,
    adminUids: "",
    status: 1,
  },
  {
    createTime: '2023-09-15 14:01:23',
    updateTime: '2023-09-19 14:25:29',
    no: 100002,
    icon:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/0QiJ-FUTM-a7e1-0I8j',
    name: 'APEX交流社群',
    summary:'由Respawn Entertainment开发和电子艺界发行的一款免费多人在线游戏。',
    type: 'public',
    joinOption: 'freeAccess',
    inviteOption: 'freeAccess',
    memberNum: 5,
    ownerUid: 2469,
    level: 6,
    adminUids: "",
    status: 1,
  },
  {
    createTime: '2023-09-15 14:01:23',
    updateTime: '2023-09-19 14:25:29',
    no: 100005,
    name: '地平线5交流社群',
    icon:'https://jxxt-1257689580.cos.ap-chengdu.myqcloud.com/0QiJ-FUTM-a7e1-0I8j',
    summary:'由Turn 10 Studios开发的赛车模拟游戏。玩家可以驾驶各种名车',
    type: 'public',
    joinOption: 'freeAccess',
    inviteOption: 'freeAccess',
    memberNum: 5,
    ownerUid: 2469,
    level: 5,
    adminUids: "",
    status: 1,
  }, 
]
