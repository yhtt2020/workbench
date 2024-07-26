// @ts-ignore
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
import DevSetting from "../page/settings/Dev.vue";
import Key from "../page/settings/Key.vue";
import Apps from "../page/Apps.vue";
import AppFrame from "../page/AppFrame.vue";
import Music from "../page/Music.vue";
import AIAssistant from "../page/AIAssistant/index.vue";
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
import SiftPaper from "../page/gallery/SiftPaper.vue";
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
// import GameDiscountDetail from "../page/gameAssistant/GameDiscountDetail.vue";
import Message from "../page/social/Message.vue";
import Team from "../page/Team.vue";
import Hall from "../page/team/Hall.vue";
import Inspector from "../page/app/Inspector.vue";
import GameCapture from "../page/gameAssistant/GameCapture.vue";
import GameMedia from "../page/gameAssistant/GameMedia.vue";
import DeckRoute from "../apps/deck/deckRoute";
import BrowserIndex from "../page/app/browser/Index.vue";
import BrowserTabs from "../page/app/browser/Tabs.vue";
import BrowserMain from "../page/app/browser/Browser.vue";
import Rank from "../page/social/Rank.vue";
import BillingRecord from "../page/social/BillingRecord.vue";

import Promotion from "../apps/promotion/page/index.vue";
import MarketIndex from "../page/market/MarketIndex.vue";
import MarketHome from "../page/market/MarketHome.vue";
import Prop from "../page/market/Prop.vue";
import RemoteCommunity from "../page/app/card/RemoteCommunity.vue";
//应用
import TomatoStart from "../page/app/tomato/TomatoStart.vue";
import Tomato from "../page/app/tomato/Tomato.vue";
/*待办*/
import Todo from "../page/app/todo/App.vue";
/*办公助手*/
import WorkIndex from "../page/work/WorkIndex.vue";
import Clipboard from "../apps/clipboard/page/Clipboard.vue";
import WorkDesk from "../page/work/Desk.vue";
/*便签*/
import Note from "../apps/note/index.vue";
import Income from "../apps/income/index.vue";
/**聊天团队模式开始**/
import ChatIndex from "../apps/chat/page/home/ChatIndex.vue";
import Chat from "../apps/chat/page/home/ChatApp.vue";
import ChatMain from "../apps/chat/page/home/ChatMain.vue";
import ChatFind from "../apps/chat/page/find/ChatFind.vue";
import MyCommunity from "../apps/chat/page/community/CommunityDetail.vue";
import OfficialCommunity from "../apps/chat/page/community/OfficialCommunity.vue";
import ChatAdmin from "../apps/chat/page/admin/Admin.vue";
import Channel from "../apps/chat/page/channels/Channel.vue";
import ChannelIndex from "../apps/chat/page/channels/ChannelsIndex.vue";
import Circle from "../apps/chat/page/channels/Group.vue";
import CircleDetail from "../apps/chat/page/channels/GroupsDetail.vue";
import SettingIndex from "../apps/chat/page/setting/SettingIndex.vue";
import CommunitySetting from "../apps/chat/page/setting/CommunitySetting.vue";
import MemberManage from "../apps/chat/page/setting/CommunityMember.vue";
import MoreSetting from "../apps/chat/page/setting/CommunityMoreSetting.vue";
import RoleAuthority from "../apps/chat/page/setting/CommunityRole.vue";

/**聊天团队模式结束**/

import Device from "../apps/console/pages/Device.vue";
import FileTransfer from "../apps/console/pages/FileTransfer.vue";
//导入应用路由
import ShortcutKeyRoute from "../apps/shortcutKey/route";
import BarrageRoute from "../apps/barrage/route";
import Power from "../page/Power.vue";
import Remote from "../apps/console/pages/Remote.vue";
import SharedDesk from "../page/SharedDesk.vue";

// 壁纸弹窗应用
import GalleryIndex from "../apps/galleryModal/page/GalleryIndex.vue"

export default [
  {
    path: "/main",
    name: "main",
    // component: Main,
    // 注册应用弹窗路由
    components: {
      default: Main,
      ai: AIAssistant,
      note: Note,
      clipboard: Clipboard,
      income: Income,
      galleryModalApp:GalleryIndex
    },
    props: true,
    children: [
      ...DeckRoute,
      ShortcutKeyRoute,

      {
        path: "/galleryModalApp",
        name: "galleryModalApp",
        component:GalleryIndex,
        meta: {
          tab1: "galleryModal",
        },
      },
      {
        path: "/income",
        name: "income",
        component: Income,
        meta: {
          tab1: "work",
          tab2: "income",
        },
      },
      {
        path: "/ai/:value?",
        name: "ai",
        component: AIAssistant,
        meta: {
          tab1: "work",
          tab2: "ai",
        },
      },
      {
        path: "/Note/:customIndex?",
        name: "note",
        component: Note,
        meta: {
          tab1: "work",
          tab2: "note",
        },
      },
      {
        path: "/clipboard",
        name: "clipboard",
        component: Clipboard,
        meta: {
          tab1: "work",
          tab2: "clipboard",
        },
      },
      {
        path: "/todo",
        name: "todo",
        component: Todo,
        meta: {
          tab1: "work",
          tab2: "todo",
        },
      },
      {
        path: "/device",
        name: "device",
        component: Device,
        children: [
          {
            meta: {
              tab1: "console",
              tab2: "fileTransfer",
              tab3: "fileTransfer",
            },
            path: "",
            name: "fileHelper",
            component: FileTransfer,
          },
          {
            meta: {
              tab1: "console",
              tab2: "fileTransfer",
              tab3: "remote",
            },
            path: "",
            name: "remote",
            component: Remote,
          },
        ],
      },
      {
        path: "/power",
        name: "power",
        component: Power,
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
        meta: {
          tab1: "home",
        },
      },
      {
        path:'/hall',
        component: Hall,
        name:'hall'
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
            name: "bill",
            component: BillingRecord,
          },
          {
            path: "/promotion",
            name: "promotion",
            component: Promotion,
          },
        ],
      },
      {
        path: "/apps",
        name: "apps",
        component: Apps,
      },
      {
        path: "/browser",
        component: BrowserMain,
        children: [
          {
            path: "",
            name: "browser",
            component: BrowserIndex,
          },
          {
            path: "/tabs",
            name: "browserTabs",
            component: BrowserTabs,
          },
        ],
      },
      {
        path: "/chat",
        component: ChatIndex,
        name: "chatIndex",
        rememberChildrenPosition: true,
        redirect: {
          name: "chat",
        },
        children: [
          BarrageRoute,
          {
            path: "/chatHome",
            name: "chat",
            component: Chat,
            meta: {
              rememberChildrenPosition: true,
            },
            redirect: {
              name: "chatFind",
            },
            children: [
              /**群聊会话列表路由**/
              {
                path: "/chatMain/:no?/:action?",
                name: "chatMain",
                component: ChatMain,
                meta: {
                  type: "chat",
                  tab1: "community",
                  tab2: "chat",
                  tab3: "session",
                },
              },
              /**群聊发现页路由**/
              {
                path: "/chatFind",
                name: "chatFind",
                component: ChatFind,
                meta: {
                  type: "find",
                  tab1: "community",
                  tab2: "chat",
                  tab3: "find",
                },
              },
              /**其他社群路由**/
              {
                path: "/com/:no/channel/:channelId?",
                name: "myCommunity",
                component: MyCommunity,
                props: true,
                meta: {
                  tab1: "community",
                  tab2: "chat",
                  tab3: "community_{no}",
                },
                /**社群设置路由**/
                children: [
                  {
                    path: "/com/set/:no",
                    name: "SettingIndex",
                    component: SettingIndex,
                    meta: {
                      tab1: "community",
                      tab2: "chat",
                      tab3: "community_{no}",
                      tab4: "settingIndex",
                    },
                    redirect: {
                      name: "CommunitySetting",
                    },
                    /**社群设置的子路由**/
                    children: [
                      {
                        path: "/com/:no/setting",
                        name: "CommunitySetting",
                        component: CommunitySetting,
                        meta: {
                          tab1: "community",
                          tab2: "chat",
                          tab3: "community_{no}",
                          tab4: "communitySetting",
                        },
                      },
                      {
                        path: "/com/:no/member",
                        name: "CommunityMember",
                        component: MemberManage,
                        meta: {
                          tab1: "community",
                          tab2: "chat",
                          tab3: "community_{no}",
                          tab4: "member",
                        },
                      },
                      {
                        path: "/com/:no/more",
                        name: "MoreSetting",
                        component: MoreSetting,
                        meta: {
                          tab1: "community",
                          tab2: "chat",
                          tab3: "community_{no}",
                          tab4: "more",
                        },
                      },
                      {
                        path: "/com/:no/role",
                        name: "RoleAuthority",
                        component: RoleAuthority,
                        meta: {
                          tab1: "community",
                          tab2: "chat",
                          tab3: "community_{no}",
                          tab4: "role",
                        },
                      },
                    ],
                  },
                ],
              },
              /**官方默认社群路由**/
              {
                path: "/OfficialCommunity",
                name: "officialCommunity",
                component: OfficialCommunity,
                props: true,
                meta: {
                  tab1: "OfficialCommunity",
                  tab2: "chat",
                  tab3: "OfficialCommunity",
                  type: "OfficialCommunity",
                  tab: "OfficialCommunity",
                },
              },
              /**管理员路由**/
              {
                path: "/chatAdmin",
                name: "chatAdmin",
                component: ChatAdmin,
                meta: {
                  type: "chatAdmin",
                  tab1: "community",
                  tab2: "chat",
                  tab3: "admin",
                },
              },
              /**社区路由**/
              {
                path: "/channel",
                name: "channel",
                component: Channel,
                meta: {
                  tab1: "channel",
                },
                redirect: {
                  name: "channelsIndex",
                },
                children: [
                  {
                    path: "",
                    name: "channelsIndex",
                    meta: {
                      tab1: "community",
                      tab2: "channel",
                      tab3: "channelsIndex",
                    },
                    component: ChannelIndex,
                  },
                  {
                    path: "",
                    name: "circle",
                    meta: {
                      tab1: "community",
                      tab2: "channel",
                      tab3: "circle",
                    },
                    component: Circle,
                  },
                  {
                    path: "",
                    name: "circleDetail",
                    meta: {
                      tab1: "community",
                      tab2: "channel",
                    },
                    component: CircleDetail,
                  },
                ],
              },
            ],
          },
        ],
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
        props: true,
        children: [
          {
            path: "/gameIndex",
            name: "gameIndex",
            redirect: {
              name: "myGame",
            },
          },
          {
            path: "/gameSetting",
            name: "gameSetting",
            component: GameSetting,
            meta: {
              tab1: "game",
            },
          },
          {
            path: "/gameCommunity",
            name: "gameCommunity",
            component: GameCommunity,
            meta: {
              tab1: "game",
            },
          },
          {
            path: "/gameMedia",
            name: "gameMedia",
            component: GameMedia,
            meta: {
              tab1: "game",
            },
          },
          {
            path: "/gameDiscount",
            name: "recommend",
            component: GameDiscount,
            meta: {
              tab1: "game",
            },
            props: true,
          },
          {
            path: "/gameIntroduction",
            name: "gameIntroduction",
            component: GameIntroduction,
            meta: {
              tab1: "game",
            },
          },
          {
            path: "/myGame",
            name: "myGame",
            component: MyGame,
            meta: {
              tab1: "game",
            },
          },
          // {
          //   path: "/GameDiscountDetail/:id",
          //   name: "GameDiscountDetail",
          //   component: GameDiscountDetail,
          //   props: true,
          //   meta: {
          //     tab1: "game",
          //   },
          // },
          {
            path: "/GameCapture",
            name: "GameCapture",
            component: GameCapture,
            meta: {
              tab1: "game",
            },
          },
        ],
      },

      {
        path: "/work",
        name: "work",
        component: WorkIndex,
        meta: {
          rememberChildrenPosition: true,
        },
        redirect: {
          name: "ai",
        },
        children: [
          {
            path: "/TomatoStart",
            name: "tomatoStart",
            component: TomatoStart,
          },
          {
            path: "/Tomato",
            name: "tomato",
            component: Tomato,
          },
          // {
          //   path: "/ai/:value?",
          //   name: "ai",
          //   component: AIAssistant,
          //   meta: {
          //     tab1: "work",
          //     tab2: "ai",
          //   },
          // },
        ],
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
            name: "sift",
            component: SiftPaper,
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
            path: "",
            name: "market",
            component: MarketHome,
          },
          {
            path: "/prop",
            name: "prop",
            component: Prop,
          },
        ],
      },
      {
        path: "/remoteCommunity",
        name: "remoteCommunity",
        component: RemoteCommunity,
      },
    ],
  },
];
