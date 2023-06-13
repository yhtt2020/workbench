import BarrageSetting from "../page/settings/BarrageSetting.vue";
import DeckHome from "../page/app/deck/DeckHome.vue";
import Setting from "../page/Setting.vue";
import Weather from "../page/app/Weather.vue";
import Watch from "../page/app/watch/Index.vue";
import Social from "../page/Social.vue";
import Com from "../page/social/Com.vue";
import SocialMy from "../page/social/My.vue";
import Invite from "../page/social/Invite.vue";
import Grade from "../page/social/Grade.vue";
import BasicSetting from "../page/settings/Basic.vue";
import Key from "../page/settings/Key.vue";
import Apps from "../page/Apps.vue";
import AppFrame from "../page/AppFrame.vue";
import Music from "../page/Music.vue";
import Status from "../page/Status.vue";
import Main from "../page/Main.vue";
import Home from "../page/Home.vue";
import BrowserSetting from "../page/settings/Browser.vue";
import Common from "../page/settings/Common.vue";
import SetupCard from "../page/app/card/SetupCard.vue";
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
import Clipboard from "../page/clipboard/Clipboard.vue"
import GameCapture from "../page/gameAssistant/GameCapture.vue"
import GameMedia from "../page/gameAssistant/GameMedia.vue";
import DeckAdd from "../page/app/deck/DeckAdd.vue";
import DeckIndex from "../page/app/deck/DeckIndex.vue";
import BrowserIndex from '../page/app/browser/Index.vue';
import BrowserMain from '../page/app/browser/Browser.vue';

// @ts-ignore
import ShortcutKey from "../page/shortcutKey/ShortcutKey.vue";
import ShareKey from "../page/shortcutKey/ShareKey.vue"
export default [
  {
    path: "/main",
    name: "main",
    component: Main,
    children: [
      {
        path: "/team",
        name: "team",
        component: Team,
        children: [
          {
            path: "",
            name: "hall",
            component: Hall,
          },
        ],
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
          },
          {
            path: "/gameSetting",
            name: "gameSetting",
            component: GameSetting,
          },
          {
            path: "/gameCommunity",
            name: "gameCommunity",
            component: GameCommunity,
          },
          {
            path: "/gameMedia",
            name: "gameMedia",
            component: GameMedia,
          },
          {
            path: "/gameDiscount",
            name: "recommend",
            component: GameDiscount,
          },
          {
            path: "/gameIntroduction",
            name: "gameIntroduction",
            component: GameIntroduction,
          },
          {
            path: "/myGame",
            name: "myGame",
            component: MyGame,
          },
          {
            path: "/GameDiscountDetail",
            name: "GameDiscountDetail",
            component: GameDiscountDetail,
            props: true,
          },
          {
            path: "/GameCapture",
            name: 'GameCapture',
            component: GameCapture,
          }
        ],
      },

      {
        path: "/deck",
        name: "deckIndex",
        component: DeckIndex,
        children: [
          {
            path: '',
            name: 'deck',
            component: DeckHome
          },
          {
            path: "/add",
            name: 'deckAdd',
            component: DeckAdd
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
        path: '/clipboard',
        name: 'clipboard',
        component: Clipboard,
      },
      {
        path:'/shortcutKey',
        name:'shortcutKey',
        component:ShortcutKey,
        // children: [
        //   {
        //     path:'/shareKey',
        //     name:'shareKey',
        //     component:ShareKey,
        //   },
        // ]
      },
    ],
  },
];
