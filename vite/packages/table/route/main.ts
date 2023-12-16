import BarrageSetting from "../page/settings/BarrageSetting.vue";

import Setting from "../page/Setting.vue";
import Weather from "../page/app/Weather.vue";
import Watch from "../page/app/watch/Index.vue";
import Social from "../page/Social.vue";
import Com from "../page/social/Com.vue";
import SocialMy from "../page/social/My.vue";
import Invite from "../page/social/Invite.vue";
import Grade from "../page/social/Grade.vue";
import BasicSetting from "../page/settings/Basic.vue";
import DevSetting from '../page/settings/Dev.vue'
import Key from "../page/settings/Key.vue";
import Apps from "../page/Apps.vue";
import AppFrame from "../page/AppFrame.vue";
import Music from "../page/Music.vue";
import AIAssistant from "../page/AIAssistant/index.vue"
import Status from "../page/Status.vue";
import Main from "../page/Main.vue";
import Home from "../page/Home.vue";
import BrowserSetting from "../page/settings/Browser.vue";
import Common from "../page/settings/Common.vue";
import SetupCard from "../page/app/card/SetupClock.vue";
import Sensor from "../page/Sensor.vue";
import Dashboard from "../page/app/watch/Dashboard.vue";
import CPUIndex from "../page/app/CPUIndex.vue";
import Gallery from "../page/Gallery.vue";
import Bing from "../page/gallery/Bing.vue";
import Wallheaven from "../page/gallery/Wallheaven.vue";
import PickingPaper from "../page/gallery/Picking.vue";
import Lively from "../page/gallery/Lively.vue";
import PapersSetting from "../page/gallery/Setting.vue";
import My from "../page/gallery/My.vue";
import Subscreen from "../page/settings/Subscreen.vue";
import GameAssistant from "../page/gameAssistant/GameAssistant.vue";
import GameIndex from "../page/gameAssistant/GameIndex.vue";
import GameSetting from "../page/gameAssistant/GameSetting.vue";
import GameCommunity from "../page/gameAssistant/GameCommunity.vue";
import GameDiscount from "../page/gameAssistant/GameDiscount.vue";
import GameIntroduction from "../page/gameAssistant/GameIntroduction.vue";
import MyGame from "../page/gameAssistant/MyGame.vue";
import GameDiscountDetail from "../page/gameAssistant/GameDiscountDetail.vue";
import Message from "../page/social/Message.vue";
import Team from "../page/Team.vue";
import Hall from "../page/team/Hall.vue";
import Inspector from "../page/app/Inspector.vue";
import GameCapture from "../page/gameAssistant/GameCapture.vue"
import GameMedia from "../page/gameAssistant/GameMedia.vue";
import DeckRoute from '../apps/deck/deckRoute'
import BrowserIndex from '../page/app/browser/Index.vue';
import BrowserTabs from '../page/app/browser/Tabs.vue';
import BrowserMain from '../page/app/browser/Browser.vue';
import Rank from '../page/social/Rank.vue';
import BillingRecord from '../page/social/BillingRecord.vue';

import Promotion from '../apps/promotion/page/index.vue';
import MarketIndex from '../page/market/MarketIndex.vue';
import MarketHome from '../page/market/MarketHome.vue';
import Prop from '../page/market/Prop.vue';
import RemoteCommunity from '../page/app/card/RemoteCommunity.vue'
//应用
import TomatoStart from '../page/app/tomato/TomatoStart.vue'
import Tomato from '../page/app/tomato/Tomato.vue'
/*待办*/
import Todo from '../page/app/todo/App.vue'
/*办公助手*/
import WorkIndex from '../page/work/WorkIndex.vue'
import Clipboard from "../apps/clipboard/page/Clipboard.vue"
import WorkDesk from '../page/work/Desk.vue'
/*便签*/
import Note from '../apps/note/index.vue'
/**聊天团队模式开始**/
import ChatDesk from '../page/chat/chatDesk.vue'
import Contact from '../page/chat/contact.vue'
import Chat from '../page/chat/chat.vue'
import ChatIndex from '../page/chat/index.vue'
// import ImTeam from '../page/chat/team.vue'
import ChatMain from '../page/chat/page/chatMain.vue'
import CommunityIndex from '../page/chat/page/communityIndex.vue'
import ChatFind from '../page/chat/page/chatFind.vue'
import MyCommunity from '../page/chat/page/communityDetail.vue'
import Channel from '../page/channels/Channels.vue'
import ChannelIndex from '../page/channels/ChannelsIndex.vue'
import Circle from '../page/channels/Groups.vue'
import CircleDetail from '../page/channels/GroupsDetail.vue'
import CommunitySetting from '../page/chat/page/setting/communitySetting.vue'
import MemberManage from '../page/chat/page/setting/memberManage.vue'
import MoreSetting from '../page/chat/page/setting/moreSetting.vue'
import RoleAuthority from '../page/chat/page/setting/roleAuthority.vue'
/**聊天团队模式结束**/

//导入应用路由
import ShortcutKeyRoute from '../apps/shortcutKey/route'
import BarrageRoute from '../apps/barrage/route'
import ChatAdmin from '../page/chat/page/admin.vue'
import Power from "../page/Power.vue";


export default [
  {
    path: "/main",
    name: "main",
    component: Main,
    children: [
      {
        path: '/power',
        name: 'power',
        component: Power

      },

      {
        path: "/inspector",
        name: "inspector",
        component: Inspector,
      },
      {
        path: "",
        name: "home",
        component: Home,
        meta:{
          tab1:'home'
        }
      },
      {
        path: "/app",
        name: "app",
        component: AppFrame,
        children: [],
      },
      {
        path: "/watch",
        name: "watch",
        component: Watch,
      },
      {
        path: "/dashboard",
        name: "dashboard",
        component: Dashboard,
      },
      {
        path: "/social",
        name: "social",
        component: Social,
        children: [
          {
            path: "",
            name: "com",
            component: Com,
          },
          {
            path: "/my",
            name: "socialMy",
            component: SocialMy,
          },
          {
            path: "/invite",
            name: "invite",
            component: Invite,
          },
          {
            path: "/grade",
            name: "grade",
            component: Grade,
          },
          {
            path: "/message",
            name: "message",
            component: Message,
          },
          {
            path: "/rank",
            name: "rank",
            component: Rank,
          },
          {
            path: "/bill",
            name: 'bill',
            component: BillingRecord
          },
          {
            path: "/promotion",
            name: 'promotion',
            component: Promotion
          }
        ],
      },
      {
        path: "/apps",
        name: "apps",
        component: Apps,
      },
      {
        path: '/browser',
        component: BrowserMain,
        children: [
          {
            path: '',
            name: 'browser',
            component: BrowserIndex
          },
          {
            path: '/tabs',
            name: 'browserTabs',
            component: BrowserTabs
          }
        ]
      },
      {
        path: '/chat',
        component: ChatIndex,
        name: 'chatIndex',
        rememberChildrenPosition: true,
        redirect: {
          name:'chat'
        },
        children: [
          BarrageRoute,
          {
            path: '/chatDesk',
            name: 'chatDesk',
            component: ChatDesk
          },

          {
            path: '/chatHome',
            name: 'chat',
            component: Chat,
            meta: {
              rememberChildrenPosition: true
            },
            redirect: {
              name: 'chatMain',
            },
            children: [
              {
                path: '/contact',
                name: 'contact',
                component: Contact,
                meta: {
                  type: 'contact',
                  tab1:'community',
                  tab2: 'chat',
                  tab3:'contact'
                }
              },
              {
                path: '/chatMain',
                name: 'chatMain',
                component: ChatMain,
                meta: {
                  type: 'chat',
                  tab1:'community',
                  tab2: 'chat',
                  tab3:'session'
                }
              },
              {
                path: '/chatAdmin',
                name: 'chatAdmin',
                component: ChatAdmin,
                meta: {
                  type: 'chatAdmin',
                  tab1:'community',
                  tab2: 'chat',
                  tab3:'admin'
                }
              },
              {
                path: '/chatFind',
                name: 'chatFind',
                component: ChatFind,
                meta: {
                  type: 'find',
                  tab1:'community',
                  tab2: 'chat',
                  tab3:'find'
                }
              },
              {
                path:'/community',
                name:'defaultCommunity',
                component:CommunityIndex,
                props:true,
                meta: {
                  tab1:'community',
                  tab2: 'chat',
                  tab3:'community'
                }
              },
              {
                path:'/myCommunity/:no',
                name:'myCommunity',
                component:MyCommunity,
                props:true,
                meta: {
                  tab1:'community',
                  tab2: 'chat',
                  tab3:'community_{no}',
                },
                children:[
                  {
                    path:'/myCommunity/:no/communitySet',
                    name:'communitySettings',
                    component:CommunitySetting,
                    meta: {
                      tab1:'community',
                      tab2: 'chat',
                      tab3:'community_{no}',
                      tab4:'communitySettings'
                    }
                  },
                  {
                    path:'/myCommunity/:no/member',
                    name:'member',
                    component:MemberManage,
                    meta: {
                      tab1:'community',
                      tab2: 'chat',
                      tab3:'community_{no}',
                      tab4:'member'
                    }
                  },
                  {
                    path:'/myCommunity/:no/more',
                    name:'more',
                    component:MoreSetting,
                    meta: {
                      tab1:'community',
                      tab2: 'chat',
                      tab3:'community_{no}',
                      tab4:'more'
                    }
                  },
                  {
                    path:'/myCommunity/:no/role',
                    name:'role',
                    component:RoleAuthority,
                    meta: {
                      tab1:'community',
                      tab2: 'chat',
                      tab3:'community_{no}',
                      tab4:'role'
                    }
                  }
                ]
              }
            ]
          },

          {
            path: "/team",
            name: "team",
            component: Team,
            children: [
              {
                path: "",
                name: "hall",
                meta: {
                  tab1:'community',
                  tab2: 'team',
                },
                component: Hall,
              },
            ],
          },
          {
            path:'/channel',
            name:'channel',
            component:Channel,
            // meta:{
            //   tab1:'channel'
            // },
            redirect:{
              name:'channelsIndex'
            },
            children:[
              {
                path:'',
                name:'channelsIndex',
                meta:{
                  tab1:'community',
                  tab2:'channel',
                  tab3:'channelsIndex'
                },
                component:ChannelIndex
              },
              {
                path:"",
                name:'circle',
                meta:{
                  tab1:'community',
                  tab2:'channel',
                  tab3:'circle'
                },
                component:Circle
              },
              {
                path:"",
                name:'circleDetail',
                meta:{
                  tab1:'community',
                  tab2:'channel'
                },
                component:CircleDetail
              }
            ]
          }

        ]
      },

      {
        path: "/music",
        name: "music",
        component: Music,
      },
      {
        path: "/weather",
        name: "weather",
        component: Weather,
      },
      {
        path: "/gameAssistant",
        name: "gameAssistant",
        component: GameAssistant,
        children: [
          {
            path: "/gameIndex",
            name: "gameIndex",
            component: GameIndex,
            meta:{
              tab1:'game'
            }
          },
          {
            path: "/gameSetting",
            name: "gameSetting",
            component: GameSetting,
            meta:{
              tab1:'game'
            }
          },
          {
            path: "/gameCommunity",
            name: "gameCommunity",
            component: GameCommunity,
            meta:{
              tab1:'game'
            }
          },
          {
            path: "/gameMedia",
            name: "gameMedia",
            component: GameMedia,
            meta:{
              tab1:'game'
            }
          },
          {
            path: "/gameDiscount",
            name: "recommend",
            component: GameDiscount,
            meta:{
              tab1:'game'
            }
          },
          {
            path: "/gameIntroduction",
            name: "gameIntroduction",
            component: GameIntroduction,
            meta:{
              tab1:'game'
            }
          },
          {
            path: "/myGame",
            name: "myGame",
            component: MyGame,
            meta:{
              tab1:'game'
            }
          },
          {
            path: "/GameDiscountDetail",
            name: "GameDiscountDetail",
            component: GameDiscountDetail,
            props: true,
            meta:{
              tab1:'game'
            }
          },
          {
            path: "/GameCapture",
            name: 'GameCapture',
            component: GameCapture,
            meta:{
              tab1:'game'
            }
          }
        ],
      },

      {
        path: "/work",
        name: 'work',
        component: WorkIndex,
        meta: {
          rememberChildrenPosition: true
        },
        redirect: '/desk',
        children: [
          {
            path: '/Note',
            name: 'note',
            component: Note,
            meta:{
              tab1:'work',
              tab2:'note'
            }
          },
          ...DeckRoute,
          {
            path: '/TomatoStart',
            name: 'tomatoStart',
            component: TomatoStart
          },

          {
            path: '/Tomato',
            name: 'tomato',
            component: Tomato
          },
          {
            path: '/desk',
            name: 'workDesk',
            component: WorkDesk,
            meta:{
              tab1:'work',
              tab2:'workDesk'
            }
          },
          {
            path: "/ai",
            name: "ai",
            component: AIAssistant,
            meta:{
              tab1:'work',
              tab2:'ai'
            }
          },
          {
            path: '/clipboard',
            name: 'clipboard',
            component: Clipboard,
            meta:{
              tab1:'work',
              tab2:'clipboard'
            }
          },
          ShortcutKeyRoute,
          {
            path: "/todo",
            name: "todo",
            component: Todo,
            meta:{
              tab1:'work',
              tab2:'todo'
            }
          }
        ]
      },

      {
        path: "/status",
        name: "status",
        component: Status,
      },
      {
        path: "/sensor",
        name: "sensor",
        component: Sensor,
      },
      {
        path: "/setting",
        name: "setting",
        component: Setting,
      },
      {
        path: "/basicSetting",
        name: "basicSetting",
        component: BasicSetting,
        children: [
          {
            path: "",
            name: "common",
            component: Common,
          },
          {
            path: "/key",
            name: "key",
            component: Key,
          },
          {
            path: "/browser",
            name: "browserSetting",
            component: BrowserSetting,
          },
          {
            path: "/subscreen",
            name: "subscreen",
            component: Subscreen,
          },
          {
            path: "/barrage",
            name: "barrageSetting",
            component: BarrageSetting,
          },

          {
            path: "/dev",
            name: "devSetting",
            component: DevSetting,
          },
        ],
      },
      {
        path: "/setting",
        name: "addCardSetting",
        component: SetupCard,
      },
      {
        path: "/CPUIndex",
        name: "CPUIndex",
        component: CPUIndex,
      },
      {
        path: "/gallery",
        name: "gallery",
        component: Gallery,
        children: [
          {
            path: "",
            name: "my",
            component: My,
          },
          {
            path: "",
            name: "bing",
            component: Bing,
          },
          {
            path: "",
            name: "wallheaven",
            component: Wallheaven,
          },
          {
            path: "",
            name: "pickingPaper",
            component: PickingPaper,
          },
          {
            path: "",
            name: "lively",
            component: Lively,
          },
          {
            path: "",
            name: "papersSetting",
            component: PapersSetting,
          },
        ],
      },


      {
        path: "/market",
        name: "marketIndex",
        component: MarketIndex,
        children: [
          {
            path: '',
            name: 'market',
            component: MarketHome
          },
          {
            path: '/prop',
            name: 'prop',
            component: Prop
          }
        ]
      },
      {
        path: "/remoteCommunity",
        name: "remoteCommunity",
        component: RemoteCommunity,
      },
    ],
  },

];
